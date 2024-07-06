const mongoose = require("mongoose");

const userStockSchema = new mongoose.Schema({
   userId: { type: String },
   sparepartName: { type: String },
   sparepartId: { type: String },
    userName: { type: String },
    freshStock:{ type: String },
    defectiveStock:{ type: String },
    // sparepart:{ type: String },
}, { timestamps: true })

const UserStockModel = new mongoose.model("userStock", userStockSchema);

module.exports = UserStockModel;