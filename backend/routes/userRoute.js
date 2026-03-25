const express = require("express");
const router = express.Router();

const { fetchEvent } = require("../controllers/user/fetchEvents");
const verifyToken = require("../middlewares/verifyToken");
const { fetchEventDetail } = require("../controllers/user/fetchEventDetail");
const { createBooking } = require("../controllers/user/createBooking");
const { fetchUserDetail } = require("../controllers/user/fetchUserDetail");
const { RZPcreateOrder } = require("../controllers/RZPcreateOrder");
const { verifyPayment } = require("../controllers/verifyPayment");
const { cancelBooking } = require("../controllers/user/cancelBooking");
const { fetchBookings } = require("../controllers/user/fetchBookings");
const { fetchAccount } = require("../controllers/user/fetchAccount");
const { deleteAccount } = require("../controllers/user/deleteAccount");

router.get("/fetchEvents", fetchEvent);
router.post("/fetchEventDetail", fetchEventDetail);
router.post("/createBooking", verifyToken, createBooking);
router.get("/fetchUserDetail", verifyToken, fetchUserDetail);
router.post("/RZPcreateOrder", verifyToken, RZPcreateOrder);
router.post("/verifyPayment", verifyToken, verifyPayment);
router.post("/cancelBooking", verifyToken, cancelBooking);
router.get("/fetchBookings", verifyToken, fetchBookings);
router.get("/fetchAccount", verifyToken, fetchAccount);
router.delete("/deleteAccount", verifyToken, deleteAccount);

module.exports = router;
