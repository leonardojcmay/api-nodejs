const express = require('express');

const User = require("../models/User");

const router = express.Router();

// Rota de cadastro de usuario
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {

        // espera o comando abaixo ser executado para continuar
        const user = await User.create(req.body);

        // removendo o password, para que não apareça no retorno JSON
        user.password = undefined;

        return res.send({ user });
    } catch (err) {
        // Verificando se ja contém o usuario cadastrado
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' });
        } else {
            return res.status(400).send({ error: 'Registration failed' });
        }

    }
});

// Fazendo com que todas as rotas feitas contenham o /auth na frente
module.exports = app => app.use('/auth', router);
