const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");  // ✅ ADD THIS

// GET all bills
router.get("/", transactionController.getAllTransactions);

// GET single bill
router.get("/:id", transactionController.getTransactionById);

// CREATE bill
router.post("/", transactionController.createTransaction);

// UPDATE bill
router.put("/:id", transactionController.updateTransaction);

// DELETE bill (optional)
//router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
