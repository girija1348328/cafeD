const express = require("express");
const { getMenu, addMenuItem } = require("../controllers/menuController");

const router = express.Router();

router.get("/", getMenu);
router.post("/addMenu", addMenuItem);

module.exports = router;
