const express = require("express");
const router = express.Router();

const { fetchEvents } = require("../controllers/company/fetchEvents");
const { fetchBookings } = require("../controllers/company/fetchBookings");
const { fetchPayments } = require("../controllers/company/fetchPayments");
const { eventSettle } = require("../controllers/company/eventSettle");
const { rejectSettle } = require("../controllers/company/rejectSettle");

router.get("/fetchEvents", fetchEvents);
router.get("/fetchBookings", fetchBookings);
router.get("/fetchPayments", fetchPayments);
router.post("/eventSettle", eventSettle);
router.post("/rejectSettle", rejectSettle);

module.exports = router;
