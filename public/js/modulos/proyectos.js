import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        Swal.fire({
            title: 'Estás seguro de eliminar el Proyecto?',
            text: "Si lo eliminas no vas a poder recuperarlo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!',
            cancelButtonText: 'No, Cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar la peticion a Axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, { params: { urlProyecto } })
                    .then(respuesta => {
                        console.log(respuesta);
                        Swal.fire(
                            'Proyecto eliminado!',
                            respuesta.data,
                            'success'
                        );
                    }).catch(() => {
                        Swal.fire(
                            'Hubo un error!',
                            'No se pudo eliminar el proyecto',
                            'error'
                        );
                    })
                setTimeout(() => { window.location.href = '/' }, 3000)
            }
        })
    })
}
export default btnEliminar;