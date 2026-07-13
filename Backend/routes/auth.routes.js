const express = require("express");
const router = express.Router();
const { signup, login, getUserProfile } = require("../controllers/auth.controller");
const { validateSignup, validateLogin } = require("../validators/auth.validator");
const authenticateJWT = require("../middleware/auth.middleware");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/user", authenticateJWT, getUserProfile);

module.exports = router;
