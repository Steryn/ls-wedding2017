<?php
/**
 * Created by ftms.
 * User: wang
 * Date: 2017/5/5
 * Time: 10:07
 */
header("Content-Type: text/html;charset=utf-8");
require_once "FtmsApi.class.php";
$FtmsApi = new FtmsApi();
$url='http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$jssdkConfig=$FtmsApi->getJssdkConfig($url);
$signPackage=$jssdkConfig['content'];

// $signP = json_encode($signPackage);
// echo $signP;exit;
// $s_time=time();
// $url2 = $_SERVER['HTTP_REFERER'];
// $nonceStr = $FtmsApi->createNonceStr();
// $string = "jsapi_ticket=".$signPackage->jsapi_ticket."&noncestr=".$nonceStr."&timestamp=".$s_time."&url=".$url2;
// $signature = sha1($string);

// $sign['appId']=$signPackage['appId'];
// $sign['timestamp']=$s_time;
// $sign['nonceStr']=$nonceStr;
// $sign['url']=$url2;
// $sign['rawString']=$string;
// $sign['signature']=$signature;

echo json_encode($signPackage);
?>