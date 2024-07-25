const express=require('express')
const Enseignant=require('../controllers/Controller')
const router=express.Router()
const authenticateToken = require('../controllers/authenticateToken');



router.get('/Getenseignant/:id?',Enseignant.Getenseignant)
router.get('/Getinfosenseignant/:id',Enseignant.Getinfosenseignant)
router.post('/Postenseignant',authenticateToken, Enseignant.Postenseignant);
router.post('/Updateinfosenseignants',Enseignant.Updateinfosenseignants);
router.post('/Updateenseignant/:id',authenticateToken,Enseignant.Updateenseignant)
router.post('/ActivateEnseignant/:id',authenticateToken,Enseignant.ActivateEnseignant)
router.get('/Enseignant',authenticateToken, Enseignant.Enseignant);

module.exports = router;
