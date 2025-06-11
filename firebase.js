require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
// const serviceAccount = require('./serviceAccountKey.json'); // Assurez-vous d'avoir le fichier serviceAccountKey.json
// const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;