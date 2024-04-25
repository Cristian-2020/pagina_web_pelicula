//  ---- Función para una alerta sencilla
function sweetAlerta(title,text,icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

// ---- Función para una alerta sencilla con botones
function sweetFire(title,icon,html) {
    Swal.fire({
        title: "<strong>" + title + "</strong>",
        icon: icon,
        html: html,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    });
}

// ---- Función para una alerta de confirmación de eliminación
function sweetConfirm(id) {
    Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "La acción no se podrá revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d00909",
        cancelButtonColor: "#8a8a8a",
        confirmButtonText: "Sí, Eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'app/models/peliculas/eliminar.php',
                type: 'POST',
                dataType: 'json',
                data: {id_pelicula: id}
            })
            .done(function (response){
                if(response.success){
                    sweetAlerta('Éxito',response.msg,'success');
                    listar_peliculas();
        
                }else{
                    sweetFire('Atención','info',response.error)
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log("Error al realizar la solicitud: "+ textStatus, errorThrown);
            })
        }
    });
}