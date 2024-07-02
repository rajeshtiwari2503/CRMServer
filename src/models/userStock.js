const mongoose = require("mongoose");

const userStockSchema = new mongoose.Schema({
   userId: { type: String },
    userName: { type: String },
    freshStock:{ type: String },
    defectiveStock:{ type: String },
    sparepart:{ type: String },
}, { timestamps: true })

const userStockModel = new mongoose.model("userStock", userStockSchema);

module.exports = userStockModel;