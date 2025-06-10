const express = require('express');
const router = express.Router();

const Question = require('../models/Question');
const Salon = require('../models/Salon');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

// ------- STATISTIQUES PAR SALON -------
router.get('/salon/:salonId', verifyToken, checkRole(['enseignant', 'admin']), async (req, res) => {
  try {
    const { salonId } = req.params;
    const nbQuestions = await Question.countDocuments({ salonId });
    const questions = await Question.find({ salonId });

    const nbReponses = questions.reduce((acc, q) => acc + (q.reponses ? q.reponses.length : 0), 0);

    let totalTemps = 0;
    let nbQuestionsAvecReponse = 0;
    questions.forEach(q => {
      if (q.reponses && q.reponses.length > 0) {
        const dateRep = q.reponses[0].date;
        const diff = (dateRep - q.date) / (60 * 1000);
        totalTemps += diff;
        nbQuestionsAvecReponse++;
      }
    });
    const tempsMoyen = nbQuestionsAvecReponse > 0 ? (totalTemps / nbQuestionsAvecReponse) : 0;
    const nbSansReponse = questions.filter(q => !q.reponses || q.reponses.length === 0).length;

    res.json({
      salonId,
      nbQuestions,
      nbReponses,
      nbSansReponse,
      tempsMoyenMinutes: tempsMoyen
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------- STATISTIQUES GLOBALES (ADMIN) -------
router.get('/global', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const nbSalons = await Salon.countDocuments();
    const nbQuestions = await Question.countDocuments();
    const questions = await Question.find();

    const nbReponses = questions.reduce((acc, q) => acc + (q.reponses ? q.reponses.length : 0), 0);

    let totalTemps = 0;
    let nbQuestionsAvecReponse = 0;
    questions.forEach(q => {
      if (q.reponses && q.reponses.length > 0) {
        const dateRep = q.reponses[0].date;
        const diff = (dateRep - q.date) / (60 * 1000);
        totalTemps += diff;
        nbQuestionsAvecReponse++;
      }
    });
    const tempsMoyen = nbQuestionsAvecReponse > 0 ? (totalTemps / nbQuestionsAvecReponse) : 0;
    const nbSansReponse = questions.filter(q => !q.reponses || q.reponses.length === 0).length;

    res.json({
      nbSalons,
      nbQuestions,
      nbReponses,
      nbSansReponse,
      tempsMoyenMinutes: tempsMoyen
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------- STATISTIQUES PAR ENSEIGNANT -------
router.get('/enseignant/:enseignantId', verifyToken, checkRole(['admin', 'enseignant']), async (req, res) => {
  try {
    const { enseignantId } = req.params;
    const salons = await Salon.find({ enseignantId });
    const salonIds = salons.map(s => s._id.toString());
    const questions = await Question.find({ salonId: { $in: salonIds } });

    const nbQuestions = questions.length;
    const nbReponses = questions.reduce((acc, q) => acc + (q.reponses ? q.reponses.length : 0), 0);

    let totalTemps = 0;
    let nbQuestionsAvecReponse = 0;
    questions.forEach(q => {
      if (q.reponses && q.reponses.length > 0) {
        const dateRep = q.reponses[0].date;
        const diff = (dateRep - q.date) / (60 * 1000);
        totalTemps += diff;
        nbQuestionsAvecReponse++;
      }
    });
    const tempsMoyen = nbQuestionsAvecReponse > 0 ? (totalTemps / nbQuestionsAvecReponse) : 0;
    const nbSansReponse = questions.filter(q => !q.reponses || q.reponses.length === 0).length;

    res.json({
      enseignantId,
      nbSalons: salons.length,
      nbQuestions,
      nbReponses,
      nbSansReponse,
      tempsMoyenMinutes: tempsMoyen
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------- STATISTIQUES PAR PÉRIODE -------
router.get('/periode', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { debut, fin } = req.query;
    if (!debut || !fin) {
      return res.status(400).json({ error: "Dates de début et fin requises (format YYYY-MM-DD)" });
    }
    const dateDebut = new Date(debut);
    const dateFin = new Date(fin);

    const questions = await Question.find({
      date: { $gte: dateDebut, $lte: dateFin }
    });

    const nbQuestions = questions.length;
    const nbReponses = questions.reduce((acc, q) => acc + (q.reponses ? q.reponses.length : 0), 0);

    let totalTemps = 0, nbQuestionsAvecReponse = 0;
    questions.forEach(q => {
      if (q.reponses && q.reponses.length > 0) {
        const dateRep = q.reponses[0].date;
        const diff = (dateRep - q.date) / (60 * 1000);
        totalTemps += diff;
        nbQuestionsAvecReponse++;
      }
    });
    const tempsMoyen = nbQuestionsAvecReponse > 0 ? (totalTemps / nbQuestionsAvecReponse) : 0;
    const nbSansReponse = questions.filter(q => !q.reponses || q.reponses.length === 0).length;

    res.json({
      debut, fin,
      nbQuestions, nbReponses, nbSansReponse, tempsMoyenMinutes: tempsMoyen
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
