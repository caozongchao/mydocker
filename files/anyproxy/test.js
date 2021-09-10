module.exports = {
    summary: 'a rule to hack response',
    *beforeSendResponse(requestDetail, responseDetail) {
        if (requestDetail.url === 'https://httpbin.org/user-agent') {
            const newResponse = responseDetail.response;
            newResponse.body += '- AnyProxy Hacked!';

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // delay
                    resolve({ response: newResponse });
                }, 5000);
            });
        }
    },
};
