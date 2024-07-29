const express = require("express");
const cors = require("cors");
require("./src/db/connection");
require("dotenv").config();

// Initialize Express app
const app = express();

// Import routes
const registration = require("./src/routers/registration");
const product = require("./src/routers/product");
const productCategory = require("./src/routers/productCategory");
const complaintNature = require("./src/routers/complaintNature");
const sparePart = require("./src/routers/sparePart");
const complaint = require("./src/routers/complaint");
const bulkUploadComplaint = require("./src/routers/bulkUploadComplaint");
const location = require("./src/routers/location");
const feedback = require("./src/routers/feedback");
const notification = require("./src/routers/notification");
const technician = require("./src/routers/technician");
const order = require("./src/routers/order");
const stock = require("./src/routers/stock");
const dashboard = require("./src/routers/dashboard");
const filterData = require("./src/routers/filterData");
const bank = require("./src/routers/bank");
const walletTransaction = require("./src/routers/bank");
const chatTicket = require("./src/routers/chatTicket");
const wallet = require("./src/routers/wallet");
const payment = require("./src/routers/payments");

// Middleware
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Routes
app.get("/", (req, res) => {
    res.json("Server is running");
});
app.use(registration);
app.use(technician);
app.use(product);
app.use(productCategory);
app.use(complaintNature);
app.use(sparePart);
app.use(complaint);
app.use(bulkUploadComplaint);
app.use(location);
app.use(feedback);
app.use(notification);
app.use(stock);
app.use(order);
app.use(dashboard);
app.use(filterData);
app.use(chatTicket);
app.use(bank);
app.use(walletTransaction);
app.use(wallet);
app.use(payment);

// Export the handler for Vercel
module.exports = (req, res) => {
    return new Promise((resolve, reject) => {
        // Wrap Express app in Vercel serverless function handler
        app(req, res, (err) => (err ? reject(err) : resolve()));
    });
};
