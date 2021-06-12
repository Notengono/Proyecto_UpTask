const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo a autenticar
const Usuarios = require('../models/Usuarios');

// Local Strategy - Login con credenciales propias

passport.use(
    new LocalStrategy(
        // Pro default passpor espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                })
                // El usuario existe y el pass no es correcto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'La clave es incorrecta.'
                    })
                }
                return done(null, usuario);

            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// Serializar el usuario 
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
})

// Deserializar el usuario 
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
})

module.exports = passport;