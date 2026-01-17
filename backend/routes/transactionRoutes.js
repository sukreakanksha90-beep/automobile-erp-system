const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactionController");

const { verifyToken } = require("../controllers/authController");
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getMyTransactions
} = require("../controllers/transactionController");

/* EXISTING ROUTES (KEEP AS THEY ARE) */
router.post("/", verifyToken, createTransaction);

router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);

/* ✅ NEW PROFILE ROUTE (ADD ONLY THIS) */
router.get("/my", verifyToken, getMyTransactions);

module.exports = router;
