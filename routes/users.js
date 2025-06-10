const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken');

// Inscription d'un utilisateur (après création sur Firebase)
router.post('/register', async (req, res) => {
   console.log("Body reçu :", req.body); // DEBUG !
  // ... suite du code
  try {
    const { uid, email, role, nom, prenom } = req.body;
    // Vérifie si l'utilisateur existe déjà (via uid ou email)
    let user = await User.findOne({ uid });
    if (user) return res.status(400).json({ error: "Utilisateur déjà enregistré" });

    user = new User({ uid, email, role, nom, prenom });
    await user.save();
    res.status(201).json({ message: "Utilisateur enregistré", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion d'un utilisateur (après Firebase Auth côté frontend)
// Ici tu peux juste vérifier l'existence côté base, le vrai login est côté Firebase Auth
router.post('/login', async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Connexion réussie", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtenir le profil utilisateur
router.get('/:uid', verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier le profil utilisateur
router.put('/:uid', verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const { nom, prenom } = req.body;
    const user = await User.findOneAndUpdate(
      { uid },
      { nom, prenom },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Profil mis à jour", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
