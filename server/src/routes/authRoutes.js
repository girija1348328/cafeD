const express = require("express");
const { register, login, getUserProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getUserProfile); 

module.exports = router;
