const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    // Buscando o authorization dentro da requisição, que poderá ser adicionado no Insomnia
    const authHeader = req.headers.authorization;

    // verificando se o token foi informado
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' })
    }

    // verificando se o token esta no formato certo
    // formato correto: Bearer dafsaf5fdsf65fds
    // separando em duas partes utilizando o split
    const parts = authHeader.split(' ');

    // verificando se não conter duas partes
    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Token error' });
    }

    // Se conter duas partes
    const [scheme, token] = parts;

    // verificando se no scheme esta escrito Bearer
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ erro: 'Token malformatted' });
    }

    // verificando se o token bate com o usuario que esta pedindo a requisição
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        // se o token não bater com token da aplicação ocorre erro
        if (err) {
            return res.status(401).send({ error: 'Token invalid' });
        }

        // se passou pelo erro, você contem a informação do user.id
        // incluindo as informações do user.id nas proximas requisições do controller

        req.userId = decoded.id;

        // utilizando next() permitindo passar para o proximo
        return next();
    });

};