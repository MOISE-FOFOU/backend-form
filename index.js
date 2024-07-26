const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./controllers/authenticateToken'); // Chemin vers le middleware
const index = require('./controllers/Controller');
const connectDB = require('./model/db');
const cookieParser = require('cookie-parser');
const cors=require('cors');

// Import des routes
const missionRoutes = require('./routes/missionRoutes')
const actualiteRoutes = require('./routes/actualiteRoutes');
const enseignantRoutes = require('./routes/enseignantRoutes');
const formationRoutes = require('./routes/formationRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes');
const presentationRoutes = require('./routes/presentationRoutes');
const realisationRoutes = require('./routes/realisationRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');

const filepath=require('./routes/fileRoutes')
const port = 8080;
const app = express();

connectDB();

// Configuration des middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware d'erreur global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Configuration des vues
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Configuration du dossier statique
app.use(express.static(path.join(__dirname, 'ressources')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use('/files', express.static(path.join(__dirname, '../uploads')));


// Utilisation des routes
app.use('/', missionRoutes);
app.use('/', actualiteRoutes);
app.use('/', enseignantRoutes);
app.use('/', formationRoutes);
app.use('/', historiqueRoutes);
app.use('/', presentationRoutes);
app.use('/', realisationRoutes);
app.use('/',filepath);
app.use('/',entrepriseRoutes)
// Routes GET et POST
app.get('/', index.index);
app.post('/signup', index.Signup);
app.post('/signin', index.Signin);
app.get('/logout', index.logout);

// Démarrage du serveur
app.listen(port, () => {
    console.log("Serveur actif sur le port " + port);
});
