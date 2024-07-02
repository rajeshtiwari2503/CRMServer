const mongoose = require("mongoose");

const brandStockSchema = new mongoose.Schema({
   brandId: { type: String },
    brandName: { type: String },
    freshStock:{ type: String },
    defectiveStock:{ type: String },
    sparepart:{ type: String },
}, { timestamps: true })

const brandStockModel = new mongoose.model("brandStock", brandStockSchema);

module.exports = brandStockModel;