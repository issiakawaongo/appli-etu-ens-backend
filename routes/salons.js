
const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

// Créer un salon (enseignant)
router.post('/create', verifyToken, checkRole(['enseignant']), async (req, res) => {
  try {
    const { nom, enseignantId } = req.body;
    const salon = new Salon({
      nom,
      enseignantId,
      etudiants: []
    });
    await salon.save();
    res.status(201).json({ message: 'Salon créé', salon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lister tous les salons
router.get('/', async (req, res) => {
  try {
    const salons = await Salon.find();
    res.json({ salons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rejoindre un salon (étudiant)
router.post('/join', verifyToken, async (req, res) => {
  try {
    const { salonId, etudiantId } = req.body;
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ error: 'Salon non trouvé' });
    }
    if (!salon.etudiants.includes(etudiantId)) {
      salon.etudiants.push(etudiantId);
      await salon.save();
    }
    res.json({ message: 'Étudiant ajouté au salon', salon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
