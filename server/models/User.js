// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // ID único fornecido pelo GitHub (CRUCIAL para a autenticação)
    githubId: {
        type: String,
        required: true,
        unique: true
    },
    // Nome de usuário do GitHub
    username: {
        type: String,
        required: true
    },
    // Opcional: Adicionar o URL do profile
    profileUrl: {
        type: String,
        default: ''
    },
    // Data de criação
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);