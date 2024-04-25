<?php 

require '../sql/connect.php';

$params = $_POST;

try{

    if(isset($params['id_pelicula']) && $params['id_pelicula'] == ""){

        $sql_comparar = "SELECT id_pelicula FROM pelicula WHERE titulo = '$params[titulo]' AND anio = '$params[anio]'";
        $comparar_pelicula = mysqli_query($con,$sql_comparar);

        if (mysqli_num_rows($comparar_pelicula) > 0) {
            
            $response = array(
                'success'=>false,
                'error'=>'Esta película ya ha sido registrada en nuestro sistema'
            );

        } else {

            $nombre_archivo = $_FILES["imagen"]["name"];
            $ruta_temporal  = $_FILES["imagen"]["tmp_name"];
            $ruta_destino   = "../../../media/tmp/" . $nombre_archivo;
            move_uploaded_file($ruta_temporal, $ruta_destino);
    
            $sql = 
                "INSERT INTO pelicula (
                    titulo,
                    anio,
                    genero,
                    descripcion,
                    duracion,
                    imagen
                ) VALUES (
                    '$_POST[titulo]',
                    '$_POST[anio]',
                    '$_POST[genero]',
                    '$_POST[descripcion]',
                    '$_POST[duracion]', 
                    '$ruta_destino'
                )";
            $guardar_pelicula = mysqli_query($con, $sql);
    
            if(mysqli_insert_id($con)>0){
                $response = array(
                    'success'=>true,
                    'msg'=>'La película fue registrada exitosamente'
                );
            }else{
                $response = array(
                    'success'=>false,
                    'error'=>'No fue posible registrar la película: '.mysqli_error($con)
                );
            }
        
        }

    }else{

        $sql_comparar = "SELECT id_pelicula FROM pelicula WHERE titulo = '$params[titulo]' AND anio = '$params[anio]' AND id_pelicula != '$params[id_pelicula]'";
        $comparar_pelicula = mysqli_query($con,$sql_comparar);

        if (mysqli_num_rows($comparar_pelicula) > 0) {

            $response = array(
                'success'=>false,
                'error'=>'Esta película ya ha sido registrada en nuestro sistema'
            );

        } else {

            $sql_existencia = "SELECT id_pelicula,imagen FROM pelicula WHERE id_pelicula = '$params[id_pelicula]'";
            $verificar_existencia = mysqli_query($con,$sql_existencia);

            if (mysqli_num_rows($verificar_existencia) > 0) {

                $row = mysqli_fetch_assoc($verificar_existencia);
                $nombre_archivo = $_FILES["imagen"]["name"];
                
                if ($nombre_archivo === "") {
                    $ruta_destino = $row["imagen"];
                } else {
                    
                    $ruta_temporal  = $_FILES["imagen"]["tmp_name"];
                    $ruta_destino   = "../../../media/tmp/" . $nombre_archivo;

                    if ($ruta_destino != $row["imagen"]) {
                        unlink($row["imagen"]);
                        move_uploaded_file($ruta_temporal, $ruta_destino);
                    }
                }

                $sql =
                    "UPDATE pelicula
                        SET
                            titulo      = '$params[titulo]',
                            anio        = '$params[anio]',
                            genero      = '$params[genero]',
                            descripcion = '$params[descripcion]',
                            duracion    = '$params[duracion]',
                            imagen      = '$ruta_destino'
                    WHERE id_pelicula = '$params[id_pelicula]'";
                $actualizar_pelicula = mysqli_query($con, $sql);
        
                if(mysqli_affected_rows($con) > 0){
                    $response = array(
                        'success'=>true,
                        'msg'=>'La película fue actualizada correctamente'
                    );
                }else{
                    if ($actualizar_pelicula) {
                        $response = array(
                            'success'=>false,
                            'error'=>'No se realizó ninguna actualización'
                        );    
                    } else {
                        $response = array(
                            'success'=>false,
                            'error'=>'No fue posible actualizar: '.mysqli_error($con)
                        );
                    }
                }

            }

        }

    }
}catch(Exception $e){
    $response = array(
        'success'=>false,
        'error'=>'Error en la consulta: ' . $e->getMessage()
    );
}

echo json_encode($response);

$con->close();
unset($response, $params, $sql, $sql_comparar, $comparar_pelicula, $nombre_archivo, $ruta_temporal, $ruta_destino, $guardar_pelicula, $sql_existencia, $verificar_existencia, $row, $actualizar_pelicula);


?>