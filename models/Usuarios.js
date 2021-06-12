const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: {
            msg: 'Usuario Ya Registrado'
        },
        validate: {
            isEmail: {
                msg: 'Colocar un correo válido'
            },
            notEmpty: {
                msg: 'El password no puede ir vacio.'
            }
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El password no puede ir vacio.' }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
});

// Metodos personalizado
Usuarios.prototype.verificarPassword = function (pass) {
    return bcrypt.compareSync(pass, this.password)
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;