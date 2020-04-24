const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs
        .readdirSync(__dirname) // Solicitando para ler um diretorio, que seria este diretorio que esta operando este index.js
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) // filtrar os arquivos, Procurando todos arquivos da pasta que não sao o index.js e não iniciam com .
        .forEach(file => require(path.resolve(__dirname, file))(app)) // todo arquivo é esparedo o app
};  
