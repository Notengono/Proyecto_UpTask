import Swal from "sweetalert2";

export const actualizarAvance = () => {
    // Buscar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        // Tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo')

        // calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // Mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        if (avance == 100) {
            Swal.fire(
                '¡El proyecto está completo!',
                '¡Felicitaciones!',
                'success'
            );
        }
    }

}