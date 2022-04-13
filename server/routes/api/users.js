const express = require('express');
const router = express.Router();
const userController = require("../../controllers/userController");

router.get("/:sub",userController.getUserInfo);
router.get("/login",userController.login);
router.patch("/updateUser/:sub",userController.updateUser);
module.exports = router;
