const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  nom: String,
  enseignantId: String,
  etudiants: [String]
});

module.exports = mongoose.model('Salon', salonSchema);
