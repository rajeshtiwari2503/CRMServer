const mongoose = require("mongoose");

const brandStockSchema = new mongoose.Schema({
   brandId: { type: String },
    brandName: { type: String },
    freshStock:{ type: String },
    defectiveStock:{ type: String },
    sparepartName:{ type: String },
    sparepartId:{ type: String },
}, { timestamps: true })

const BrandStockModel = new mongoose.model("brandStock", brandStockSchema);

module.exports = BrandStockModel;