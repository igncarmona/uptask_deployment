const express = require('express');
const router = express.Router();

// Importar Express Validator
const { body } = require('express-validator');

// Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
  // ruta para el home
  router.get('/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );  
  router.get('/nuevo-proyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyectos
  );
  router.post('/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  // Listar Proyecto
  router.get('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );

  //Actualizar el Proyecto
  router.get('/proyecto/editar/:id',
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );
  
  router.post('/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );

  // Eliminar Proyecto
  router.delete('/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );
  
  // Tareas 

  //agregar tareas
  router.post('/proyectos/:url',
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );
  // actualizar Tarea
  router.patch('/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  // ELiminar Tarea
  router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // Crear nueva cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta',usuariosController.crearCuenta);
  // confirmar cuenta
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  // Iniciar Sesion

  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  //cerrar sesion
  router.get('/cerrar-sesion',authController.cerrarSesion);

  //Reestablecer contraseña
  router.get('/reestablecer', usuariosController.formReestablecerPassword);
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.actualizarPassword);

  

  
  
  return router;
}