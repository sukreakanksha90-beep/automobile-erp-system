require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const invoiceRoutes = require("./routes/invoiceRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const jobCardRoutes = require("./routes/jobCardRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("ERP Backend is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/jobcards", jobCardRoutes);
app.use("/api/employees", employeeRoutes);

// ❌ DO NOT listen on Vercel
module.exports = app;
