const User = require('../models/User');

function checkRole(roles = []) {
  // roles = ['enseignant'], ou ['admin', 'enseignant'], etc.
  return async (req, res, next) => {
    try {
      const uid = req.user.uid; // UID Firebase du token
      const user = await User.findOne({ uid });
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: "Accès interdit : rôle insuffisant" });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur dans le middleware de rôle" });
    }
  }
}

module.exports = checkRole;
