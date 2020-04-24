// Conectando com o banco de dados
const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Indica que quando buscar a lista de usuarios, para não vir o campo de password junto
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Alterando o objeto que esta sendo salvo no banco de dados
// Encryptando password
UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    // alterando o password para o hash gerado
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;