$(document).ready(function() {

    // ---- Función para poner una máscara (formato) para los input de año y duración
    $('#anio').mask('9999');
    $('#duracion').mask('99:99:99');

    // ---- Función para mostrar la imagen al adjuntarlo en el input
    $('#imagen').change(function(){
        var file = this.files[0];
        if(file && file.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('.img-fluid').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // ---- Condición para mostrar u ocultar los botones de agregar y editar y modificar el título de la modal
    if ($("#id_pelicula").val() !== "") {

        $("#mdl_title_registro").html('<i class="fas fa-clapperboard"></i> Actualizar Película');
        $("#btn_guardar_pelicula").removeClass('btn-success').addClass('btn-warning').html('<i class="fas fa-edit"></i> Actualizar');
        
        obtener_pelicula($("#id_pelicula").val());
    } else {
        $("#mdl_title_registro").html('<i class="fas fa-clapperboard"></i> Registrar nueva Película');
        $("#btn_guardar_pelicula").addClass('btn-success').removeClass('btn-warning').html('<i class="fas fa-save"></i> Guardar');
    }

    // ---- Función para detectar que el año ingresado sea número y no símbolos
    $("#anio").blur(function() {
        let anio = $("#anio").val();
        if (anio < 1 || isNaN(anio)) {
            sweetAlerta('Advertencia!','Debes ingresar un formato de fecha válido','warning');
			$("#anio").val("");
        }
    })

    //  ---- Función para limpiar los formularios
    $("#btn_limpiar_formulario").click(() => {
        $("#frm_registro_pelicula").trigger("reset");
        $('.img-fluid').attr('src', "../../../media/img/img-defecto.png");
        $("#descripcion").html("");
    })

    //  ---- Llamamos la función para validar los campos
    $("#btn_guardar_pelicula").click(() => {
        validar();
    })

});

//  ---- Esta función nos sirve para detectar que los campos que son requeridos esten llenos
function validar() {
    
    let requeridos;
    let mensajes;

    requeridos = {
        titulo: 'required',
        anio: 'required',
        genero: 'required',
        duracion: 'required',
        descripcion: 'required'
    };
    mensajes = {
        titulo: 'Debe ingresar el título',
        anio: 'Debe ingresar el año',
        genero: 'Debe seleccionar el género',
        duracion: 'Debe ingresar la duración',
        descripcion: 'Debe ingresar una descripción'
    }

    $("#frm_registro_pelicula").validate().destroy();
    $("#frm_registro_pelicula").validate({
        ignore: "",
        rules: requeridos,
        messages: mensajes,
        errorElement: 'span',
        errorPlacement: function(error, element) {
            error.addClass('invalid-feedback');
            if (element.parent().hasClass('input-group-text')) {
                element.closest('.input-group').append(error);
            } else {
                element.parent().append(error);
            }
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        submitHandler: function() {
            guardar_pelicula();
        }
    })
}


//  ---- Función para guardar o actualizar los datos
function guardar_pelicula(){

    let formData = new FormData($("#frm_registro_pelicula")[0]);

    $.ajax({
        url: 'app/models/peliculas/registrar.php',
        type: 'POST',
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
    })
    .done(function (response){
        if(response.success){
            $("#mdl_registro_pelicula").modal('hide');
            cargar_peliculas()
            
            sweetAlerta('Éxito',response.msg,'success');

        }else{
            sweetFire('Atención','info',response.error)
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("Error al realizar la solicitud: "+ textStatus, errorThrown);
    })
}

//  ---- Función para cargar nuevamente la tabla de las películas al cerrar la modal
function cargar_peliculas() {
    $('#mdl_registro_pelicula').on('hidden.bs.modal', function (event) {
        listar_peliculas();
    });
}

//  ---- Función para obtener los datos de la base de la película seleccionada y así poder editarlos
function obtener_pelicula(id_pelicula){
    $.ajax({
        url: 'app/models/peliculas/obtener.php',
        type: 'POST',
        dataType: 'json',
        data: {
            id_pelicula: id_pelicula
        }
    })
    .done(function (response){
        if(response.success){
            
            let valores = response.resultado[0];
            let imagen = valores.imagen === '../../../media/tmp/' ? "../../../media/img/img-defecto.png" : valores.imagen;
            
            $('.img-fluid').attr('src', imagen);
            $("#titulo").val(valores.titulo);
            $("#anio").val(valores.anio);
            $("#genero").val(valores.genero);
            $("#duracion").val(valores.duracion);
            $("#descripcion").html(valores.descripcion);

        }else{
            sweetFire('Atención','info',response.error)
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("Error al realizar la solicitud: "+ textStatus, errorThrown);
    })
}