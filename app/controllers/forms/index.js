$(document).ready(function () {
    listar_peliculas();

    // ---- Función para habilitar el audio al darle click al icono de Netflix
    $("#icon-netflix").click(() => {
        $('#audio-netflix')[0].play();
    })

    // ---- Función para abrir la modal de ingresa de película
    $("#btn_nueva_pelicula").click(() => {
        abrirModal('');
    })

    // ---- Función para abrir la modal para actualizar el registro de la película seleccionada
    $("#tabla_peliculas").on('click','.editar-pelicula', function (){
        let id_pelicula = $(this).attr('data-id');
        abrirModal(id_pelicula);
    });

    // ---- Función para abrir la modal para eliminar el registro de la película seleccionada
    $("#tabla_peliculas").on('click','.eliminar-pelicula', function (){
        let id_pelicula = $(this).attr('data-id');
        sweetConfirm(id_pelicula);
    });

});

// ---- Función para mostrar la tabla de las películas
function listar_peliculas(){
    $.ajax({
        url: 'app/models/peliculas/listar.php',
        type: 'POST',
        dataType: 'json',
        data: {}
    })
    .done(function (response){
        if(response.success){
            let cuerpo = '';
            for (let i = 0; i < response.total; i++) {

                let imagen = response.resultado[i].imagen === '../../../media/tmp/' ? "../../../media/img/img-defecto.png" : response.resultado[i].imagen;

                cuerpo +=
                '<tr>'+
                    '<td style="width:50px">'+(i+1)+'</td>'+
                    '<td style="width:50px">'+
                        '<img class="tbl-img" src="'+imagen+'" style="width:100px">'+
                    '</td>'+
                    '<td style="width:200px">'+response.resultado[i].titulo+'</td>'+
                    '<td style="width:200px">'+response.resultado[i].anio+'</td>'+
                    '<td style="width:200px">'+response.resultado[i].genero+'</td>'+
                    '<td style="width:450px">'+response.resultado[i].descripcion+'</td>'+
                    '<td style="width:200px">'+response.resultado[i].duracion+'</td>'+
                    '<td style="width:150px">'+
                        '<button type="button" title="Editar" class="btn btn-warning mr-2 editar-pelicula" data-id="'+response.resultado[i].id_pelicula+'">'+
                            '<i class="fas fa-edit"></i>'+
                        '</button>'+
                        '<button type="button" title="Eliminar" class="btn btn-danger eliminar-pelicula" data-id="'+response.resultado[i].id_pelicula+'">'+
                            '<i class="fas fa-trash-can"></i>'+
                        '</button>'+
                    '</td>'+
                '</tr>';
            }

            $("#tb_peliculas").html(cuerpo);
        }else{
            sweetFire('Atención','info',response.error)
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("Error al realizar la solicitud: "+ textStatus, errorThrown);
    })
}

// ---- Función para abrir la modal
function abrirModal(id_pelicula) {
    $('#div-modal').load('app/views/modals/formulario.html', function() {
        $("#id_pelicula").val(id_pelicula);
        $('#mdl_registro_pelicula').modal('show');
    })
}