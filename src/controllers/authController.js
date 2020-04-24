const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const User = require("../models/User");

const router = express.Router();

// função de gerar token, para que seja possivel utilizar no register e authenticate
function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        // fazendo expirar em 1 dia o token, calculado por segundos
        expiresIn: 86400,
    });
}

// Rota de cadastro de usuario
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {

        // espera o comando abaixo ser executado para continuar
        const user = await User.create(req.body);

        // removendo o password, para que não apareça no retorno JSON
        user.password = undefined;

        // retornar o usuario e tambem o token de autenticação
        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) {
        // Verificando se ja contém o usuario cadastrado
        if (await User.findOne({ email })) {
            return res.status(400).send({ err: 'User already exists' });
        } else {
            return res.status(400).send({ err: 'Registration failed' });
        }

    }
});

// Rota de autenticação
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    // verificando se existe o e-mail no banco de dados
    // verificando também se o password informado é realmente o password dele
    const user = await User.findOne({ email }).select('+password');

    // se o usuario não existir
    if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }

    // comparando se a senha que esta fazendo o login é a mesma que esta salva no banco de dados
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Invalid password' });
    }

    // removendo password no retorno JSON
    user.password = undefined;

    // Se esta tudo certo, retornar o usuario e gerar o token de autenticação
    res.send({
        user,
        token: generateToken({ id: user.id }),
    });
})

// Fazendo com que todas as rotas feitas contenham o /auth na frente
module.exports = app => app.use('/auth', router);
