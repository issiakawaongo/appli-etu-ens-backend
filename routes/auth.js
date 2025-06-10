// @ts-ignore
const express = require('express');
const router = express.Router();
const admin = require('../firebase');

// Inscription
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: role
    });
    res.status(201).json({ message: 'Utilisateur créé', uid: user.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Middleware de vérification du token
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
}

// Exemple d’utilisation de verifyToken pour une route protégée
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Bienvenue', user: req.user });
});

module.exports = router;
