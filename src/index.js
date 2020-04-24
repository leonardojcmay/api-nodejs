const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Para conseguir decodar os parametros vindo da url

require('./app/controllers/index')(app);

app.listen(3000);