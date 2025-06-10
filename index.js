const express = require('express');
const app = express();
app.use(express.json());

// Importation des routes
const reportsRoutes = require('./routes/reports');
const uploadsRoutes = require('./routes/uploads');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const salonsRoutes = require('./routes/salons');
const questionsRoutes = require('./routes/questions');
const mongoose = require('mongoose');

// Middleware pour lire le JSON
app.use('/reports', reportsRoutes);
app.use('/uploads', uploadsRoutes); // Pour servir les fichiers uploadés
app.use('/users', usersRoutes);
app.use('/questions', questionsRoutes);
app.use('/salons', salonsRoutes);

// Route d'accueil (page racine)
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'application étudiant-enseignant !");
});

// Branchement des routes d’authentification
app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
// Connexion MongoDB

mongoose.connect('mongodb+srv://admin:1234@cluster0.czuhmsl.mongodb.net/student_teacher?retryWrites=true&w=majority&appName=Cluster0', {
})
.then(() => console.log('Connexion MongoDB réussie !'))
.catch((err) => console.error('Erreur MongoDB :', err));
