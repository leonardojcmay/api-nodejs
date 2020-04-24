const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Para conseguir decodar os parametros vindo da url

require('./controllers/authController')(app);
require('./controllers/projectController')(app);

app.listen(3000);