<?PHP
$im = imageCreateFromPNG("img01.png") ;
header('Content-type: image/gif');
$e=imageGIF($im);
//echo "FAILED?";
//echo $e;
imageDestroy($im);
?>