<?php

error_reporting(E_ERROR);

$server = 'localhost';
$user   = 'root';
$pass   = '';
$bd     = 'bd_peliculas';

$con = mysqli_connect($server,$user,$pass,$bd);

if ($con) {
    // $con->set_charset("utf-8");
    mysqli_query ($con,"SET NAMES 'utf8'");
	date_default_timezone_set('America/El_Salvador');
} else {
    $response = array(
        'success' => false,
        'error'   => 'No hay conexión a la base de datos'
    );

    echo json_encode($response);
    exit();
}

?>