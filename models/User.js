const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // id Firebase Auth
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['etudiant', 'enseignant', 'admin'], required: true },
  nom: String,
  prenom: String,
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
