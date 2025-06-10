const mongoose = require('mongoose');

const reponseSchema = new mongoose.Schema({
  auteurId: String, // enseignantId ou étudiantId
  texte: String,
  date: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
  auteurId: String, // étudiant qui pose la question
  texte: String,
  fichierUrl: String,
  isPrivee: Boolean,
  reponses: [reponseSchema],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
