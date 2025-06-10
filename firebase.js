const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Assurez-vous d'avoir le fichier serviceAccountKey.json
// const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;