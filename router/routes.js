const express = require('express');
const controller = require('../controllers/controller');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cors = require("cors");
router.use(cors());

router.post('/manual-sign_up',controller.manualSignUp);
router.post('/manual-sign_in',controller.Manual_login);
router.get('/user-details', authMiddleware, controller.getUserDetails);
router.get('/get_users',controller.getUsers);

module.exports=router;