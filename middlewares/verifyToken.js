// const admin = require('/firebase'); // Ou le chemin vers ton fichier de config firebase
const admin = require ('../firebase.js'); // Assurez-vous que le chemin est correct
async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou mal formé' });
  }
  const idToken = header.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // On met l'utilisateur décodé dans la requête
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = verifyToken;
