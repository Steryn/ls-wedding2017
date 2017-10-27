<?php
header('Access-Control-Allow-Origin:*');

$url 		= 'http://corollaclub.ftms.com.cn/v1/api/user/get';
$app_id 	= 'ziyun';
$app_secret = 'T2sKlygtK*snRteTZ%IJkO$1c5)f2ZZ1SY82KX#!';

$input = json_decode(file_get_contents('php://input'), true);
$mobile = $input['mobile'];

// 13466601333
$timestamp = time();

$params = [
	'app_id' => $app_id,
	'mobile' => $mobile,
	'timestamp' => time(),
];

$params['token'] = create_sign($params,$app_secret);

$ret = post($url, $params);

echo $ret;
exit;

function create_sign($params,$secret) 
{
	ksort($params);

	$string = '';
	foreach ($params as $key => $val) {
		if (is_array($val)) {
			foreach ($val as $item) {
				$string .= $item;
			}
			continue;
		}
		$string .= $val;
	}

	$string .= $secret;
	
	return md5($string);
}

function post($url,$data)
{
	$ch = curl_init();  

	curl_setopt($ch, CURLOPT_URL, $url);  
	curl_setopt($ch, CURLOPT_POST, 1);  
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);  
	curl_setopt($ch, CURLOPT_AUTOREFERER, 1);  
	curl_setopt($ch, CURLOPT_MAXREDIRS, 4);  
	curl_setopt($ch, CURLOPT_ENCODING, ""); //必须解压缩防止乱码  
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 5.1; zh-CN) AppleWebKit/535.12 (KHTML, like Gecko) Chrome/22.0.1229.79 Safari/535.12");  
	curl_setopt($ch, CURLOPT_TIMEOUT, 15);  

	$output = curl_exec($ch);  
	curl_close($ch);  

	return $output;
	
}