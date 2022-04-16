const express = require('express');
const router = express.Router();
const userController = require("../../controllers/userController");
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: 'https://dev-sbjztdyr.us.auth0.com/api/v2/',
    issuerBaseURL: `https://dev-sbjztdyr.us.auth0.com/`,
  });
router.patch("/updateUser/:sub",checkJwt,userController.updateUser);
module.exports = router;
