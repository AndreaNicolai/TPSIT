const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const USERS_FILE = path.join(__dirname, 'users.json');
const POSTS_FILE = path.join(__dirname, 'posts.json');

function readJsonFile(file) {
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}

function writeJsonFile(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let currentUser = null; // Variabile per tenere traccia dell'utente autenticato

// Pagina principale
app.get('/', (req, res) => {
    const posts = readJsonFile(POSTS_FILE);
    res.render('index', { user: currentUser, posts });
});

// Pagina di registrazione
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    let users = readJsonFile(USERS_FILE);
    if (users.find(u => u.username === req.body.username)) {
        return res.send('Username già in uso!');
    }
    users.push({ username: req.body.username, password: req.body.password });
    writeJsonFile(USERS_FILE, users);
    res.redirect('/login');
});

// Pagina di login
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    let users = readJsonFile(USERS_FILE);
    let user = users.find(u => u.username === req.body.username && u.password === req.body.password);
    if (user) {
        currentUser = user;  // Impostiamo l'utente come "attivo"
        res.redirect('/');  // Rimandiamo alla home
    } else {
        res.send('Login fallito! Username o password errati.');
    }
});

// Logout
app.get('/logout', (req, res) => {
    currentUser = null;  // Rimuoviamo l'utente attivo
    res.redirect('/');  // Rimandiamo alla home
});

// Pubblicazione post
app.post('/post', (req, res) => {
    if (!currentUser) return res.redirect('/login');  // Se non c'è un utente autenticato, rimandiamo al login
    
    const content = req.body.content;
    const posts = readJsonFile(POSTS_FILE);
    posts.push({ username: currentUser.username, content, date: new Date().toLocaleString() });
    writeJsonFile(POSTS_FILE, posts);
    res.redirect('/');  // Rimandiamo alla home dopo la pubblicazione
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
