const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const { fetchEvents } = require("../controllers/scanner/fetchEvents");
const { scanTicket } = require("../controllers/scanner/scanTicket");

router.get("/fetchEvents", verifyToken, fetchEvents);
router.post("/scanTicket", verifyToken, scanTicket);

module.exports = router;
