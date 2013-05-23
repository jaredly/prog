<?php
include "GIFEncoder.class.php";
/*
	Build a frames array from sources...
*/
Header ( 'Content-type:text/html' );
if ($GET_["name"]){
    $name=$GET_["name"];
}
else
{
    $name="sample";
}
if ($GET_["speed"]){
    $speed=intval($GET_["speed"]);
}
else
{
    $speed=100;
}
if ( $dh = opendir ( "data/$name/gif/" ) ) {
	while ( false !== ( $dat = readdir ( $dh ) ) ) {
		if ( $dat != "." && $dat != ".." ) {
			$frames [ ] = "data/$name/gif/".$dat;
                        echo "<br>Dat $dat<br>"."data/$name/gif/".$dat;
			$framed [ ] = speed;
		}
	}
	closedir ( $dh );
}
/*
		GIFEncoder constructor:
        =======================

		image_stream = new GIFEncoder	(
							URL or Binary data	'Sources'
							int					'Delay times'
							int					'Animation loops'
							int					'Disposal'
							int					'Transparent red, green, blue colors'
							int					'Source type'
						);
*/
$gif = new GIFEncoder	(
							$frames,
							$framed,
							0,
							2,
							0, 0, 0,
							"url"
		);
/*
		Possibles outputs:
		==================

        Output as GIF for browsers :
        	- Header ( 'Content-type:image/gif' );
        Output as GIF for browsers with filename:
        	- Header ( 'Content-disposition:Attachment;filename=myanimation.gif');
        Output as file to store into a specified file:
        	- FWrite ( FOpen ( "myanimation.gif", "wb" ), $gif->GetAnimation ( ) );
*/
Header ( 'Content-type:image/gif' );
echo	$gif->GetAnimation ( );
?>
