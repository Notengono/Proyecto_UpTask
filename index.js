// import express from 'express';
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const passport = require('./config/passport');

// Helpers con algunas funciones
const helpers = require('./helpers');

// Conexión a la base
const db = require('./config/db');

// Importar el modelo
require('./models/Usuarios')
require('./models/Proyectos')
require('./models/Tareas')

db.sync()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error));

// Crear una app de express
const app = express();

// Habilitar bodyParser para leer datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Agregamos express validator a toda la app
// app.use(expressValidator());

//Lugar donde cargar los archivos estaticos
app.use(express.static('public'))

// Habilitar Pug
app.set('view engine', 'pug');


// Añadir vistas (Carpetas), es donde vamos a encontrar los archivos de todas las vistas.
app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser());

// Sesiones para navergar en distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'TinchoChinchu',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    
    console.log(res.locals.usuario)
    next();
});

// Aprendiendo Middleware
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

// Ruta para el home
app.use('/', routes())

app.listen(4000);

require('./handlers/emails')