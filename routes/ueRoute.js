
const express=require('express')
const Ue=require('../controllers/Controller')
const router=express.Router()
const authenticateToken = require('../controllers/authenticateToken');



router.get('/Getue/:id?',Ue.Getue)
router.get('/Getueinfos/:id1/id2',Ue.Getueinfos)

router.post('/Postue',authenticateToken, Ue.Postue);
router.post('/Updateue/:id', authenticateToken, Ue.Updateue);
router.post('/Activateue/:id',authenticateToken,Ue.Activateue)
router.get('/Ue',authenticateToken, Ue.Ue);

module.exports = router;
