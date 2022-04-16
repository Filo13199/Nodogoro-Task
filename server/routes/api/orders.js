const express = require('express');
const router = express.Router();
const orderController = require("../../controllers/orderController");
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: 'https://dev-sbjztdyr.us.auth0.com/api/v2/',
    issuerBaseURL: `https://dev-sbjztdyr.us.auth0.com/`,
  });
router.post("/placeOrder", checkJwt,orderController.createOrder);
router.get("/getUsersOrders/:sub/:pageSize/:page", checkJwt,orderController.getUsersOrders);
router.delete("/deleteOrder/:sub/:orderId/:pageSize/:page", checkJwt,orderController.deleteOrder);
module.exports = router;
