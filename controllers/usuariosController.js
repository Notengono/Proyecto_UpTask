const Usuarios = require('../models/Usuarios')
const expressValidator = require('express-validator')
const enviarEmail = require('../handlers/emails')

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar una sesión en UpTask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    // Obtenemos datos
    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email,
            password
        });

        // Crear url de confirmación
        const confirmaUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Crear objeto de usuario
        const usuario = {
            email
        }

        // Enviar correo
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmaUrl,
            archivo: 'confirma-cuenta'
        })

        // redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta.')
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email, password
        })
    }
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// Cambiar el estado de una cuenta
exports.confirmarCorreo = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    // Si el correo no existe
    if (!usuario) {
        req.flash('error', 'Correo NO valido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Usuario confirmado');
    res.redirect('/iniciar-sesion')
}