const express = require('express');
const router = express.Router();
const authControllers = require('./api/controllers/auth.controller');
const { verifyAccessToken } = require('./helpers/jwt_helpers');

router.route('/signUp').post(authControllers.signUp);

router.route('/signIn').post(authControllers.signIn);

router
  .route('/getUserData/:name/:contact')
  .get(verifyAccessToken, authControllers.getUserData);

router.route('/logout').delete(verifyAccessToken, authControllers.logout);

module.exports = router;
