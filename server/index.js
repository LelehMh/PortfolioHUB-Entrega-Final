// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit'); 
const passport = require('passport'); 
const session = require('express-session'); 
const cors = require('cors'); 
const path = require('path'); // <<< NOVA LINHA: Importa o módulo path

// 2. Conecta o arquivo de configuração do Passport (AGORA ELE PODE LER AS VARS)
require('./passport');
// ... (o restante do arquivo continua o mesmo)

const app = express();
const PORT = process.env.PORT || 3000;

// 3. CONFIGURAÇÃO DO CORS
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// --- 4. Middlewares de Segurança ---
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// --- 5. Configuração de Sessão e Passport ---
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- 6. Conexão com MongoDB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.log('ERRO no MongoDB:', err.message));

// --- 7. Rotas de Autenticação ---
// Rota de Login: Inicia o fluxo OAuth
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email', 'read:user', 'public_repo'] })
);

// Rota de Callback: Retorno do GitHub
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: 'http://localhost:5173/' }),
    (req, res) => {
        // Redireciona para o dashboard do frontend
        res.redirect('http://localhost:5173/dashboard');
    }
);

// Rota de Exemplo Protegida
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Olá, ${req.user.username}! Login com GitHub funcionando.`);
    } else {
        res.redirect('/auth/github');
    }
});

// Rota de Logout
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('http://localhost:5173/'); // Redireciona para o frontend
    });
});

// --- 8. Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
