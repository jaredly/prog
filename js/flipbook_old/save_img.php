<?php
  try {
echo "hello";
//header('Content-type:image/gif');

$name=$_POST["name"];
$data=eval("return ".$_POST['code'].';');
$sv=eval("return ".$_POST['size'].";");
//echo $_POST['size'];
//echo $name;
$im=imageCreate($sv[0],$sv[1]);

for ($x=0;x<$sv[0];$x++){
    for ($y=0;$y<$sv[1];$y++){
        $col=$data[$x][$y];
        $c=imageColorAllocateAlpha($im,$col[0],$col[1],$col[2],$col[3]);
        imageSetPixel($im,$x,$y,$c);
    }
}

header("Content-type: image/gif");
imagegif($im);

} catch (Exception $e){ 
    echo $e->getMessage();
}
?>