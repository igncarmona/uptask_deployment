const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    } 

    //si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');

}

// Funcion para cerrar sesion

exports.cerrarSesion = (req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');// al cerrar sesion nos lleva al login
    })
}

// genera un token si el usuario es valido

exports.enviarToken  = async (req, res) => {
    //verificar que el usuario existe
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email }});

    // si no existe el usuario 
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    // si existe
    // necesitamos generar un token
    usuario.token = crypto.randomBytes(20).toString('hex');

   
    // y una expiracion
    usuario.expiracion = Date.now() + 3600000;

    // guardarlos en la base de datos
    await usuario.save();
    
    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    // envia el correo con el token

    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'

    });
    
    // terminar
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}   

exports.validarToken  = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: { token: req.params.token }
    });

    // sino encuentra el usuario

    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Constraseña'
    })
}

// cambia el password por uno nuevo

exports.actualizarPassword = async (req, res ) => {
    //verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
                //[Op.lte] : Date.now()
            }
        }
    })

    // verificamos si el usuario existe
    if(!usuario){
        req.flash('error','No Valido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
   // removemovemos los campos token y expiracion
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos el nuevo password
    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

    
}