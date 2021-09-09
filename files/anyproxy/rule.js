// 规则配置
var config = {
    localImg: true, // 公众号的图片返回本地图片
    m: 3000, // 自动下拉的时间间隔 m ~ n 秒之间
    n: 5000,
};

var url = require('url');
var querystring = require('querystring');
var fs  = require("fs");
var img = fs.readFileSync(__dirname + "/black.png");

var redis = require('redis');
var redisClient = redis.createClient('redis://111111@redis:6379/1');

module.exports = {
    // 模块介绍
    summary: '微信公众号爬虫',
    // 发送请求拦截
    *beforeSendRequest(requestDetail) {
        if (!config.localImg) return null;
        // 将请求图片变成本地图片，加快文章显示
        if(/mmbiz\.qpic\.cn/i.test(requestDetail.url)){
            const localResponse = {
                statusCode: 200,
                header: { 'Content-Type': 'image/png' },
                body: img
            };
            return {
                response: localResponse
            };
        }
    },
    // 发送响应前处理
    *beforeSendResponse(requestDetail, responseDetail) {
        try {
            // 解析连接中的参数信息
            var link = requestDetail.url;

            // 历史页面第一页数据
            if(/mp\/profile_ext\?action=home/i.test(link)){
                // 取得响应内容
                var serverResData = responseDetail.response.body.toString();
                // 取得公众号唯一标识biz
                var biz = getBizByLink(link);

                // 取得微信公众号历史数据的第一页数据，包含公众号详情及最新的文章信息
                var account = getAccount(biz, serverResData);
                // 数据上传到服务器
                serverPost(account.articles)

                // 根据返回的数据状态组装相应的自动滚动加载JS
                var autoNextScrollJS = getAutoNextScrollJS();

                // 修改返回的body内容，插入JS
                var newResponse = Object.assign({}, responseDetail.response);
                newResponse.body += autoNextScrollJS;
                return {
                    response: newResponse
                };
            }

            // 向下翻页的数据的AJAX请求处理
            if(/mp\/profile_ext\?action=getmsg/i.test(link)){
                var biz = getBizByLink(link);
                var content = JSON.parse(responseDetail.response.body.toString());
                content = JSON.parse(content.general_msg_list);

                var articles = getArticles(biz, content.list);
                serverPost(articles);
                return null;
            }
            return null;
        } catch (e) {
            console.log("程序运行异常");
            console.log(e);
            throw e;
        }

    }
};



// 转义符换成普通字符
function escape2Html(str){
    const arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

/**
 * 从URL中解析出biz
 * @param link
 * @returns {biz}
 */
function getBizByLink(link) {
    var identifier = querystring.parse(url.parse(link).query);
    return identifier.__biz;
}

/**
 * 取得微信公众号及最新的文章信息
 * @param biz
 * @param serverResData
 * @returns {{}}
 */
function getAccount(biz, serverResData) {
    var account = {};
    // 解析公众号的数据
    account.nickname = /var nickname = "(.+?)"/.exec(serverResData)[1];
    account.headimg = /var headimg = "(.+?)"/.exec(serverResData)[1];
    account.biz = biz;
    account.crawlTime = new Date().getTime();

    // 解析文章列表数据
    var msgList = /var msgList = '(.+)';\n/.exec(serverResData)[1];
    msgList = JSON.parse(escape2Html(msgList).replace(/\\\//g,'/'));
    msgList = msgList.list;
    account.articles = getArticles(biz, msgList);
    return account;
}

/**
 * 解析封装取得自己想要文章信息
 * @param biz
 * @param content
 * @returns {Array}
 */
function getArticles(biz, content) {
    var articles = [];
    for (var i=0, len=content.length ; i < len ; i++) {
        var post = content[i];
        var cmi = post.comm_msg_info;
        // 只采取图文消息的数据，目前所知type=3就只有一张图片，其它类型未知
        if (cmi.type != 49) continue;
        var amei = post.app_msg_ext_info;
        var obj = getMidAndIdx(amei.content_url);

        articles.push({
            biz: biz,
            mid: obj.mid,
            title: amei.title,
            digest: amei.digest,
            contentUrl: amei.content_url,
            sourceUrl: amei.source_url,
            author: amei.author,
            cover: amei.cover,
            copyrightStat: amei.copyright_stat,
            datetime: cmi.datetime,
            idx: obj.idx
        });
    }
    return articles;
}

/**
 * 从连接取得mid及idx
 * @param link
 * @returns {{mid: *, idx: *}}
 */
function getMidAndIdx(link) {
    var identifier = querystring.parse(url.parse(link.replace(/amp;/g, '')).query);
    return {
        mid: identifier.mid,
        idx: identifier.idx
    }
}

/**
 * 向服务上传抓取到的数据
 * @param data 数据
 */
function serverPost(data) {
    redisClient.rpush('articles', JSON.stringify(data), function (err, reply) {
        console.log(reply);
    });
}

/**
 * 组装自动向下滚动翻页的JS
 *
 * @returns {string}
 */
function getAutoNextScrollJS() {
    var nextJS = '';
    nextJS += '<script type="text/javascript">';
    nextJS += '    var end = document.createElement("p");';
    nextJS += '    document.body.appendChild(end);';
    nextJS += '    (function scrollDown(){';
    nextJS += '        end.scrollIntoView();';
    nextJS += '        var loadMore = document.getElementsByClassName("loadmore with_line")[0];';
    nextJS += '        if (loadMore.style.display) {';
    nextJS += '            setTimeout(scrollDown,Math.floor(Math.random()*('+config.n+'-'+config.m+')+'+config.m+'));';
    nextJS += '        } ';
    nextJS += '    })();';
    nextJS += '<\/script>';
    return nextJS;
}