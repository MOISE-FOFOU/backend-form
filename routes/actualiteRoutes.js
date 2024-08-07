const express=require('express')
const Actualites=require('../controllers/Controller')
const router=express.Router()
const authenticateToken = require('../controllers/authenticateToken');



router.get('/Getactualite/:id?',Actualites.Getactualite)
router.post('/Postactualite',authenticateToken, Actualites.Postactualite);
router.post('/Updateactualite/:id', authenticateToken, Actualites.Updateactualite);
router.post('/ActivateActualite/:id',authenticateToken,Actualites.ActivateActualite)
router.get('/Actualite',authenticateToken, Actualites.Actualite);

module.exports = router;
