// server/passport.js
const dotenv = require('dotenv'); // Adicione esta linha

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy; 
const User = require('./models/User'); 

// 1. Serialização e Desserialização de Usuário
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); 
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// 2. Configuração da Estratégia GitHub
passport.use(new GitHubStrategy({
    proxy: true, 
    // AGORA ESTAS VARIÁVEIS TÊM CERTEZA QUE EXISTEM!
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback" 
  },
async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Tenta encontrar o usuário pelo githubId
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
            return done(null, user);
        } else {
            // 2. Se não existir, cria um novo usuário no banco de dados
            user = new User({
                githubId: profile.id,
                username: profile.username,
                profileUrl: profile._json.html_url
            });
            await user.save();
            return done(null, user);
        }
    } catch (err) {
        // Em caso de erro (ex: conexão com o DB falhar), retorna o erro
        return done(err, null);
    }
}));
