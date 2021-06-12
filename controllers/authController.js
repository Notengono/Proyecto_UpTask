// AuthController.js
const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
// const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const enviarEmail = require('../handlers/emails')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Controlar si el usuario está loguado o no
exports.usuarioAutenticado = (req, res, next) => {

    // si el usuario esta autenticado
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('./iniciar-sesion')
}

// Funcion de cerrar la sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

// Generar un token de recuperacion si el usuario es valido
exports.enviarToken = async (req, res) => {
    // Verificamos que el usuario exista
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // Existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Reseteo de Clave',
        url: resetUrl,
        archivo: 'Reestablecer-password'
    })
    req.flash('correcto', 'Se te envió un mensaje a tu corre')
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // Formulario 
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// Cambiar clave por la nueva
exports.actualizarPassword = async (req, res) => {
    // Verifica Token y Fecha

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // Hashear pass
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null;
    usuario.expiracion = null;

    // Almacenamos el nuevo pass
    await usuario.save();

    req.flash('correcto', 'Tu contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}