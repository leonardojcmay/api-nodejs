const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
// importando mail
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');
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

// Rota de esqueci minha senha
router.post('/forgot_password', async (req, res) => {
    // solicitando o e-mail para saber qual o e-mail que quer mudar a senha
    const { email } = req.body;

    try {
        // verificando se realmente o e-mail esta cadastrado na base de dados
        const user = await User.findOne({ email });

        // Se nao encontrar
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        // Gerando token para ir para o e-mail, que funcione somente para este usuario e tambem para este tipo de requisição
        // E que tambem tenha um tempo de expiração
        // gerando token
        const token = crypto.randomBytes(20).toString('hex');

        // tempo de expiração para o token
        // colocando 1 hora a mais do tempo agora
        const now = new Date();
        now.setHours(now.getHours() + 1);

        // alterar o usuario que foi acabado de gerar o token
        await User.findByIdAndUpdate(user.id, {
            // set quer dizer quais campos ira setar
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        // enviando e-mail
        mailer.sendMail({
            to: email,
            from: 'leojcmay@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err) {
                //console.log(err);
                return res.status(400).send({ error: 'Cannot send forgot password email' });
            } else {
                return res.send();
            }
        });


    } catch (err) {
        //console.log(err);
        res.status(400).send({ err: 'Erro on forgot password, try again' })

    }
})

// Rota de reset password
router.post('/reset_password', async (req, res) => {
    // recebe na requisição
    const { email, token, password } = req.body;

    try {
        // verificando se realmente o e-mail esta cadastrado na base de dados
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        // Se nao encontrar
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        // se existir verificar se token esta de acordo
        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token invalid' });
        }

        // verificar se o token não esta expirado
        const now = new Date();

        if (now > user.passwordResetExpires) {
            return res.status(400).send({ error: 'Token expired, generate a new one' });
        }

        // se deu tudo certo
        // atualizar senha do usuario
        user.password = password;

        await user.save();

        // retorno so para dar um ok, dizendo que esta tudo certo
        res.send();

    } catch (err) {
        res.status(400).send({ err: 'ECannot reset password, try again' })
    }

});

// Fazendo com que todas as rotas feitas contenham o /auth na frente
module.exports = app => app.use('/auth', router);
