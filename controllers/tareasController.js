const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');




exports.agregarTarea = async (req, res, next) => {
    // Obtenemos el proyecto actual
    const proyectos = await Proyectos.findAll();
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});
    const tareas = await Tareas.findAll({where: { proyectoId: proyecto.id}});
    
    // leer el valor del input
    const {tarea} = req.body;

    let errores = [];

    if(tarea.trim() === ''){
        errores.push({'texto': 'Agrega un nombre a la tarea'});
    }

    if(errores.length > 0 ){
        
        res.render('tareas', {
            nombrePagina : 'Tareas Proyecto',
            errores,
            proyecto,
            tareas,
            proyectos
        })
    }else {
         // si no hay errores
         // insertar en BD         
         // estado 0 = incompleto y Id del proyecto
        const estado = 0;
        const proyectoId = proyecto.id;

        // insertar en la base de datos
        const resultado = await Tareas.create({tarea, estado, proyectoId});
        
        if(!resultado){
            return next();
        }

         // redireccionar
        res.redirect(`/proyectos/${req.params.url}`);
    }    

   






    

    

}

exports.cambiarEstadoTarea = async (req, res) => {
    const { id }= req.params;
    const tarea = await Tareas.findOne({where: { id }})// es equivalente a poner {id: id }
    
    // cambiar el estado
    let estado= 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado= estado;

    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado');
    
}

exports.eliminarTarea = async (req, res) => {
    
    
    const { id }  = req.params;

    // Eliminar la Tarea

    const resultado = await Tareas.destroy( {where : {id}});
     
    if(!resultado) return next();
    
    res.status(200).send('La tarea a sido eliminada');
}