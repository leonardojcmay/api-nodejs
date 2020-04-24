const path = require('path');
const nodemailer = require('nodemailer');

// importando pacote para utilização de template no e-mail
const hbs = require('nodemailer-express-handlebars');
// importando configuração de mail
const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
});

transport.use('compile', hbs({
    //viewEngine: 'handlebars',
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

module.exports = transport;