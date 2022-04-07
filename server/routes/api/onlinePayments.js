const express = require('express');
const router = express.Router();
const onlinePaymentController = require("../../controllers/onlinePaymentController");

router.post("/getPaymentTokenShop",onlinePaymentController.initiatePaymentShop);
router.post("/confirmHealthNutritionRequest/:orderId",onlinePaymentController.confirmHealthNutritionRequest);
router.post("/authenticatePaymobResponse",onlinePaymentController.confirmHealthNutritionRequest);
router.post("/shopTransactionProcessed",onlinePaymentController.shopTransactionProcessed);
router.post("/paySavedCardShop/:cardId",onlinePaymentController.paySavedCardShop)
module.exports = router;
