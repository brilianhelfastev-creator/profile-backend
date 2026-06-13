const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Rute POST untuk login
router.post("/login", authController.login);

// Rute POST untuk register
router.post("/register", authController.register);

// Rute GET untuk lihat semua users
router.get("/users", authController.getAllUsers);

module.exports = router;
