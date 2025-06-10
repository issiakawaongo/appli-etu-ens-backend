const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// Config Multer : stocker dans le dossier "uploads/"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // nom unique : timestamp-nom-origine
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Route POST pour l’upload (protégée par verifyToken)
router.post('/', verifyToken, upload.single('fichier'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu !" });
  }
  // Retourne l’URL du fichier (à ajuster selon ton hébergement)
  res.status(201).json({
    message: "Fichier uploadé avec succès",
    url: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
