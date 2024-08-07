const express=require('express')
const Formation=require('../controllers/Controller')
const router=express.Router()
const authenticateToken = require('../controllers/authenticateToken');



router.get('/Getformation/:id?',Formation.Getformation)
router.post('/Postformation',authenticateToken, Formation.Postformation);
router.post('/Updateformation/:id',authenticateToken,Formation.Updateformation)
router.post('/Activateformation/:id',authenticateToken,Formation.ActivateFormation)
router.get('/Formation',authenticateToken, Formation.Formation);

module.exports = router;
