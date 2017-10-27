<?php

    // header("Content-Type: text/html;charset=utf-8");
    require_once "FtmsApi.class.php";

    $leverId = $_POST['leverId'];
    $openid = $_POST['DLRnopenidame'];
    $name = $_POST['name'];
    $tel = $_POST['tel'];
    $DLRname = $_POST['DLRname'];
    $DLRcode = $_POST['DLRcode'];
    $carModel = $_POST['carModel'];
    $archiveId = $_POST['archiveId'];
    $fromStatus = $_POST['fromStatus'];

    $return = $FtmsApi->setMsg($leverId,$openid,$name,$tel,$DLRcode,$DLRname,$carModel,$archiveId,$fromStatus);
    echo $return;

?>