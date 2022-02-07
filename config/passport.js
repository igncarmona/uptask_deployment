const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// referencia al modelo donde vamos a autenticar

const Usuarios = require('../models/Usuarios');


// Local Strategy- login cin credenciales propios(Usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try{
                const usuario = await Usuarios.findOne({
                    where: {email: email}
                });
                // el usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){                    
                    return done(null, false, {
                        message : 'Password Incorrecto'
                        

                    })
                }
                // el usuario existe pero no esta activo
                //aaaaaaaaaaaaa


                // El email existe, y el password es correcto
                return done(null, usuario);


            } catch(error) {
                // ese usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })

            }
        }
    )
);

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null,usuario);
});



// deserealizar el usuario

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar

module.exports = passport;
