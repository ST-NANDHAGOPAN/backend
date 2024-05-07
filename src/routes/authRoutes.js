const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const passport = require("passport");
const { validateRequest, checkValidationResult } = require('../middleware/validationMiddleware');

router.post('/admin/login',validateRequest("login") ,checkValidationResult,passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true
  }), AuthController.adminLogin );

router.post('/user/login',validateRequest("login") ,checkValidationResult,passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true
  }),AuthController.userLogin );
  
router.post('/verify_token', AuthController.verifyToken);
router.post('/admin/register',AuthController.adminRegister);
router.post('/user/register' ,AuthController.userRegister);
module.exports = router;
