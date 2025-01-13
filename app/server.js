const express = require("express");
const path = require("path");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const app = express();
const userRoute = require('./routes/User');

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
};
const server = https.createServer(sslOptions, app);

app.set('public', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/css')));

app.use(session({
    secret: 'server.cert',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    },
}));

app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'accueil.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
server.listen(8080, () => {
    console.log('Server running https://localhost:8080');
});
