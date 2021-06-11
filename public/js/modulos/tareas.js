import axios from "axios";
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

                Swal.fire({
                    title: 'Deseas Borrar esta Tarea?',
                    text: "Una Tarea eliminada no se puede recuperar",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrar!',
                    cancelButtonText: 'Cancelar'
                  }).then((result) => {
                        if (result.isConfirmed) {
                            // enviar delete por medio de axios
        
                            const url = `${location.origin}/tareas/${idTarea}`;
                            axios.delete(url, { params: {idTarea}})
                                .then(function(respuesta){
                                    
                                    if(respuesta.status === 200){
                                        // eliminar el nodo
                                        tareaHTML.parentElement.removeChild(tareaHTML);
                                        // opcional una alerta
                                        Swal.fire(
                                            'Eliminado!',
                                            respuesta.data,
                                            'success'
                                        );
                                        actualizarAvance();
                                    }                           
                                    
                                })
                                .catch(() => {
                                    Swal.fire({
                                        icon:'error',
                                        title: 'Hubo un error',
                                        text: 'No se pudo eliminar el proyecto'
                                    })
                                });
                               
                        }
                  })

        }

    });
}


export default tareas;