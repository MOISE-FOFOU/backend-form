const express=require('express')
const realisation=require('../controllers/Controller')
const router=express.Router()
const authenticateToken = require('../controllers/authenticateToken');



router.get('/Getrealisation/:id?',realisation.Getrealisation)
router.post('/Postrealisation',authenticateToken, realisation.Postrealisation);
router.post('/Updaterealisation/:id',authenticateToken,realisation.Updaterealisation)
router.post('/Activaterealisation/:id',authenticateToken,realisation.ActivateRealisation)
router.get('/Realisation',authenticateToken, realisation.Realisation);

module.exports = router;
