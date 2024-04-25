<?php

require '../sql/connect.php';

try{

    $params   = $_POST;
    $response = array();

    $sql =
        "SELECT
            titulo,
            anio, 
            CAST(genero AS UNSIGNED) AS genero,
            descripcion,
            duracion,
            imagen
        FROM pelicula
            WHERE id_pelicula = '$params[id_pelicula]'";
    $resultado = mysqli_query($con, $sql);

    if($resultado){
        if(mysqli_num_rows($resultado)>0){
            $items = array();
            while($fila = mysqli_fetch_assoc($resultado)){
                array_push($items, $fila);
            }

            $response = array(
                'success' => true,
                'resultado' => $items,
                'total' => COUNT($items)
            );
        }else{
            $response = array(
                'success'=>false,
                'error'=>'No se encontró la pelìcula seleccionada'
            );
        }
    }else{
        $response = array(
            'success'=>false,
            'error'=>mysqli_error($con)
        );
    }

    echo json_encode($response);
}catch(Exception $e){
    $response = array(
        'success'=>false,
        'error'=>'Error en la consulta: ' . $e->getMessage()
    );

    echo json_encode($response);
}

$con->close();
unset($response);

?>