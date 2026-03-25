const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const { createEvent } = require("../controllers/admin/createEvent");
const { fetchEvent } = require("../controllers/admin/fetchEvents");
const { editEvent } = require("../controllers/admin/editEvent");
const { fetchBookings } = require("../controllers/admin/fetchBookings");
const { deleteEvent } = require("../controllers/admin/deleteEvent");
const { personalMail } = require("../controllers/admin/sendpersonalmail");
const { addUpi } = require("../controllers/admin/addupi");
const { getPaymentDetails } = require("../controllers/admin/getPaymentDetail");
const {
  fetchpaymentEvents,
} = require("../controllers/admin/fetchpaymentEvents");
const { withdrawReq } = require("../controllers/admin/withdrawReq");
const { deleteUpi } = require("../controllers/admin/deleteUpi");
const { updateAdmin } = require("../controllers/admin/updateAdmin");
const { deleteAdmin } = require("../controllers/admin/deleteAdmin");

router.post("/createEvent", verifyToken, createEvent);
router.post("/fetchEvent", verifyToken, fetchEvent);
router.post("/editEvent", verifyToken, editEvent);
router.post("/deleteEvent", verifyToken, deleteEvent);
router.post("/fetchBookings", verifyToken, fetchBookings);
router.post("/personalMail", verifyToken, personalMail);
router.post("/addUpi", verifyToken, addUpi);
router.post("/getPaymentDetails", verifyToken, getPaymentDetails);
router.post("/fetchpaymentEvents", verifyToken, fetchpaymentEvents);
router.post("/withdrawReq", verifyToken, withdrawReq);
router.post("/deleteUpi", verifyToken, deleteUpi);
router.post("/updateAdmin", verifyToken, updateAdmin);
router.post("/deleteAdmin", verifyToken, deleteAdmin);

module.exports = router;
