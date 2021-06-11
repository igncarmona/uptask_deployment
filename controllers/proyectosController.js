const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');



exports.proyectosHome = async (req,res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});
    
    res.render('index',{
        nombrePagina : 'Proyectos',
        proyectos
    });
} 

exports.formularioProyectos = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    res.render('nuevo-proyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});
    // validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }
    // si hay errores

    if(errores.length > 0 ){
        
        res.render('nuevo-proyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
         // si no hay errores
         // insertar en BD
         const usuarioId = res.locals.usuario.id;
         await Proyectos.create({ nombre, usuarioId });
         //redireccionar al home
         res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;    
    const proyectosPromise =  Proyectos.findAll({ where: { usuarioId }});
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    //consultar tareas del proyecto actual

    const tareas = await Tareas.findAll({ where: {proyectoId: proyecto.id}});
    
    if(!proyecto) return next();
    
    // render a la vista
    
    res.render('tareas', {
        nombrePagina: 'Tareas Proyecto',
        proyecto,
        proyectos,
        tareas
    })
};

exports.formularioEditar = async (req, res) => {
    
    const usuarioId = res.locals.usuario.id;      
    const proyectosPromise =  Proyectos.findAll({ where: { usuarioId }});
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);
    // render a la vista
    res.render('nuevo-proyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto

    })
};

exports.actualizarProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});
    // validar que tengamos algo en el input

    const { nombre } = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }
    // si hay errores

    if(errores.length > 0 ){
        
        res.render('nuevo-proyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else {
         // si no hay errores
         // Actualizar en BD
         
         await Proyectos.update(
             { nombre: nombre },
             { where: {
                 id: req.params.id
             }}
             
             );
         //redireccionar al home
         res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
   // req, (query o params) para acceder a la url

   const {urlProyecto} = req.query;
   
   const resultado = await Proyectos.destroy({where: {
       url: urlProyecto
   }});

   if(!resultado){
      return next();
   }
   res.status(200).send('Proyecto Eliminado Correctamente!');
}