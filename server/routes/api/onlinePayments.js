const express = require('express');
const router = express.Router();
const onlinePaymentController = require("../../controllers/onlinePaymentController");

router.post("/getPaymentToken",onlinePaymentController.getPaymentToken);
router.post("/confirmHealthNutritionRequest",onlinePaymentController.confirmHealthNutritionRequest);
module.exports = router;
