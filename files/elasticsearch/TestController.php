<?php

namespace api\v1\controllers;

use Yii;
use yii\web\Controller;
use Elasticsearch\ClientBuilder;

class TestController extends Controller
{
    public function actionIndex()
    {
        $hosts = [
            'elasticsearch:9200'
        ];

        $client = ClientBuilder::create()->setHosts($hosts)->build();

        $params = [
            'index' => 'order_terminal',
            'type' => 'record',
            "body" => [
                "query"=>[
                    "match"=>["openid"=>'omJpxxGB6YDbJzNZl6VGrpSCCO_o']
                ]
            ]
        ];

        $response = $client->search($params);
        var_dump($response);
    }
}
