// criando conexão com o banco de dados mongoDB
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/noderest', { useMongoClient: true });
// mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;