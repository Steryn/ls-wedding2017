<?php
/**
 * Created by ftms.
 * User: wang
 * Date: 2017/5/5
 * Time: 10:01
 */
$FtmsApi = new FtmsApi();
class FtmsApi {
    public function __construct() {
    }
    /**
     * 获取jssdk配置
     */

    public function getJssdkConfig($url){
        $postUrl ='http://wx.ftms.com.cn/index.php/Wechat/JsSdk/index.html';
        $_time = $this->getMillisecond();
        $public_key = 'ftms_js_sdk_validate';
        $secret_key = md5($public_key.'yqft_wx@$$%YZW'.$_time);
        $postData = json_encode(
            array(
                "body"=>array("url"=>$url ),
                "head"=>array(
                    "public_key"=>$public_key,
                    "secret_key"=>$secret_key,
                    "timestamp"=>$_time
                )));
        $data = array('request'=>$postData);

        $request = $this->curlPost($postUrl,$data,'post');
        return json_decode($request,true) ;
    }
    /**
     * 解析JSON编码，如果有错误，则返回错误并设置错误信息d
     * @param json $json json数据
     * @return array
     */
    private function parseJson($json) {
        $jsonArr = json_decode($json, true);

        if (isset($jsonArr['errcode'])) {
            if ($jsonArr['errcode'] == 0) {
                $this->result = $jsonArr;
                return true;
            } else {
                $this->error = Weixin::ErrorCode($jsonArr['errcode']);
                return false;
            }
        }else {
            return $jsonArr;
        }
    }

    public function createNonceStr($length = 16) {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
        $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }
    /**
     * 获取13位时间戳
     */
    function getMillisecond() {
        list($t1, $t2) = explode(' ', microtime());
        return $t2.ceil( ($t1 * 1000) );
    }
    /**
     * 发送请求
     */
    public function curlPost($url = null, $data = array(), $method = 'get', $options = array())
    {
        // print_r($data);die;
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        if ($data || $method == 'post') {
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        if (stripos($url, 'https://') === 0) {
            curl_setopt($curl, CURLOPT_SSLVERSION, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        }

        if ($options && is_array($options)) {
            curl_setopt_array($curl, $options);
        }
        curl_setopt($curl,CURLOPT_TIMEOUT,5);
        $curlData = curl_exec($curl);
        curl_close($curl);

        return $curlData;
    }

    /**
     * 记录留资信息
     * 参数依次为：线索级别，分享粉丝的openid，留资姓名，留资电话
     * 经销商DLRcode，经销商名字，意向车系，活动标识，地点参数
     *$leverId,$openid,$name=1,$tel=2,
     *$DLRcode=3,$DLRname=4,$carModel=5,$archiveId=6,$fromStatus=7
     */
    public function setMsg($leverId,$openid,$name=1,$tel=2,$DLRcode=3,$DLRname=4,$carModel=5,$archiveId=6,$fromStatus=7){
        // $url ='http://ftms-wechat.bjscfl.com/index.php?g=Interface&m=Usershare&a=addMsgGw';
        $testUrl = 'http://union.ftms.bjscfl.com/Wechat/UserShare/addMsgGw';
        $url ='http://api.ftms.com.cn/Wechat/UserShare/addMsgGw.html';

        //公钥
        $publickey  = "ftms_js_sdk_validate";
        //私钥
        $privatekey = "yqft_wx@$$%YZW";
        //当前时间戳 （13位）
        $timestamp  = $this->getMillisecond();

        $Token = md5($publickey . "&" . $timestamp . "&" . $privatekey);
        
        $pdata=array(
            "public_key"=>$publickey,
            "secret_key"=>$privatekey,
            "timestamp"=>$timestamp,
            "openid"=>$openid,
            "name"=>$name,
            "tel"=>$tel,
            "DLRcode"=>$DLRcode,
            "DLRname"=>$DLRname,
            "modelId"=>$carModel,
            "archiveId"=>$archiveId,
            "fromStatus"=>$fromStatus,
            "leverId"=>$leverId,
        );
        $returnData = $this->curlPost($url,$pdata,'post');
        return($returnData);
        //return json_decode($returnData,true) ;

    }
}
