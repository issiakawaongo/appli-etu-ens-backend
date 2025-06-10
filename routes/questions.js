const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const verifyToken = require('../middlewares/verifyToken');

// 1. Poser une question
router.post('/ask',verifyToken, async (req, res) => {
  try {
    const { salonId, auteurId, texte, isPrivee } = req.body;
    const question = new Question({
      salonId,
      auteurId,
      texte,
      isPrivee,
      reponses: [],
      date: new Date()
    });
    await question.save();
    res.status(201).json({ message: 'Question posée', question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Lister toutes les questions d’un salon
router.get('/salon/:salonId', async (req, res) => {
  try {
    const salonId = req.params.salonId;
    const questions = await Question.find({ salonId });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Ajouter une réponse à une question
router.post('/:id/repondre', verifyToken, async (req, res) => {
  try {
    const questionId = req.params.id;
    const { auteurId, texte } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question non trouvée' });
    }
    question.reponses.push({
      auteurId,
      texte,
      date: new Date()
    });
    await question.save();
    res.json({ message: 'Réponse enregistrée', reponses: question.reponses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Voir toutes les réponses d’une question
router.get('/:id/reponses', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question non trouvée' });
    }
    res.json({ reponses: question.reponses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:questionId/fichier', verifyToken, async (req, res) => {
  const { questionId } = req.params;
  const { fichierUrl } = req.body;
  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { fichierUrl },
      { new: true }
    );
    if (!question) return res.status(404).json({ error: "Question non trouvée" });
    res.json({ message: "Fichier associé à la question", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PATCH /questions/:questionId/reponse/:reponseId/fichier
router.patch('/:questionId/reponse/:reponseId/fichier', verifyToken, async (req, res) => {
  const { questionId, reponseId } = req.params;
  const { fichierUrl } = req.body; // On envoie l’URL dans le body
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question non trouvée" });

    const reponse = question.reponses.id(reponseId);
    if (!reponse) return res.status(404).json({ error: "Réponse non trouvée" });

    reponse.fichierUrl = fichierUrl;
    await question.save();

    res.json({ message: "Fichier associé à la réponse", reponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
