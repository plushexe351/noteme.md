const express = require("express");
const { keepAlive } = require("../controllers/keepAliveController");

const router = express.Router();

router.get("/keep-alive", keepAlive);

module.exports = router;
