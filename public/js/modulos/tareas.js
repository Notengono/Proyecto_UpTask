import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            const url = `${location.origin}/tareas/${idTarea}`
            axios.patch(url, { idTarea })
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                    }

                    actualizarAvance();
                })
        }

        if (e.target.classList.contains('fa-trash')) {
            const tareaHtml = e.target.parentElement.parentElement;
            const idTarea = tareaHtml.dataset.tarea;

            Swal.fire({
                title: 'Estás seguro de eliminar la tarea?',
                text: "Si la eliminas no vas a poder recuperarla!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borrar!',
                cancelButtonText: 'No, Cancelar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Enviar la peticion a Axios
                    const url = `${location.origin}/tareas/${idTarea}`
                    axios.delete(url, { params: { idTarea } })
                        .then(function (respuesta) {
                            if (respuesta.status === 200) {
                                tareaHtml.parentElement.removeChild(tareaHtml);

                                Swal.fire(
                                    'Tarea eliminada!',
                                    respuesta.data,
                                    'success'
                                );

                                actualizarAvance();
                            }
                        })
                }
            })


        }

    })
}

export default tareas;