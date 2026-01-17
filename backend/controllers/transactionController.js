const Transaction = require("../models/Transaction");
const InvoiceCounter = require("../models/InvoiceCounter");
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      invoiceNo: req.body.invoiceNo,
      invoiceDate: req.body.invoiceDate,
      customer: req.body.customer || {},
      services: Array.isArray(req.body.services) ? req.body.services : [],
      subtotal: req.body.subtotal || 0,
      cgstTotal: req.body.cgstTotal || 0,
      sgstTotal: req.body.sgstTotal || 0,
      discount: req.body.discount || 0,
      grandTotal: req.body.grandTotal || 0,
      payments: req.body.payments || { cash: 0, upi: 0, credit: 0 },
      totalPaid: req.body.totalPaid || 0,
      balanceAmount: req.body.balanceAmount || 0,
      paymentStatus: req.body.paymentStatus || "Pending",

      // 🔥 ADD THIS LINE
      createdBy: req.user.id
    });

    await transaction.save();
    await InvoiceCounter.findOneAndUpdate(
      { name: "invoice" },
      { $inc: { seq: 1 } },
      { new: true }
    );

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Transaction Save Error:", err);
    res.status(500).json({
      message: "Transaction save failed",
      error: err.message
    });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const bill = await Transaction.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// PROFILE → BILLING HISTORY
// ===============================
// 🔹 Get logged-in user's billing history
// exports.getMyTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find({
//       $or: [
//         { createdBy: req.user.id },
//         { createdBy: { $exists: false } } // legacy bills
//       ]
//     }).sort({ createdAt: -1 });

//     res.json(transactions);
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch billing history",
//       error: err.message
//     });
//   }
// };

// 🔥 Get billing history for logged-in user
exports.getMyTransactions = async (req, res) => {
  try {
    // Find all transactions created by the logged-in user
    const bills = await Transaction.find({ createdBy: req.user.id }).sort({ createdAt: -1 });

    res.json(bills);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch billing history", 
      error: err.message 
    });
  }
};


