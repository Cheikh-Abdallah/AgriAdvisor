const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { auth } = require('../middleware/auth.middleware');

// Liste des utilisateurs
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-motDePasse')
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});

// Suppression utilisateur
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Utilisateur supprimé"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }
});
router.get('/techniciens/attente', auth, async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const techs = await User.find({
      role: 'technicien',
      statut: 'en_attente'
    }).select('-motDePasse');

    res.json(techs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
router.get('/techniciens/attente', auth, async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const techs = await User.find({
      role: 'technicien',
      statut: 'en_attente'
    }).select('-motDePasse');

    res.json(techs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Validation d'un technicien
router.put('/techniciens/:id/valider', auth, async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Accès refusé'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable'
      });
    }

    user.statut = 'valide';

    await user.save();

    res.json({
      message: 'Technicien validé avec succès'
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;