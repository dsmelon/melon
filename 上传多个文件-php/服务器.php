<?php
	header("Content-Type:text/html;charset=utf8");
	date_default_timezone_set("asia/shanghai");
	$doc=$_FILES["toLoad"];
	$err=0;
	foreach($doc["name"] as $key=>$value){
		$ext=pathinfo($value);
		$ext=date("Ymdhis$key.").$ext["extension"];
		move_uploaded_file($doc["tmp_name"][$key],"resource/".$ext);
		if($doc["error"][$key]) $err++;
	}
	echo $err."个文件上传失败<br>";
	echo count($doc["name"])-$err."个文件上传成功！";
	
?>