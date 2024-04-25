<?php 

require '../sql/connect.php';

$params = $_POST;

try{

    $sql_existencia = "SELECT id_pelicula,imagen FROM pelicula WHERE id_pelicula = '$params[id_pelicula]'";
    $verificar_existencia = mysqli_query($con,$sql_existencia);

    if (mysqli_num_rows($verificar_existencia) > 0) {

        $row = mysqli_fetch_assoc($verificar_existencia);
        unlink($row["imagen"]);

        $sql = "DELETE FROM pelicula WHERE id_pelicula = '$params[id_pelicula]'";
        $eliminar_pelicula = mysqli_query($con,$sql);

        if(mysqli_affected_rows($con)>0){
            $response = array(
                'success'=>true,
                'msg'=>'La película fue eliminada correctamente'
            );
        }else{
            $response = array(
                'success'=>false,
                'error'=>'No fue posible eliminar la película: '.mysqli_error($con)
            );
        }

    } else {

        $response = array(
            'success'=>false,
            'error'=>'No fue posible encontrar el registro'
        );

    }

}catch(Exception $e){
    $response = array(
        'success'=>false,
        'error'=>'Error en la consulta: ' . $e->getMessage()
    );
}

echo json_encode($response);

$con->close();
unset($response, $params, $sql, $sql_existencia,  $verificar_existencia, $eliminar_pelicula, $row);


?>