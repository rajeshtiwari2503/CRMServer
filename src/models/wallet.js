const mongoose=require("mongoose");

const walletTransactionSchema=new mongoose.Schema({
    serviceCenterId:{type:String},
    serviceCenterName:{type:String},
    totalCommission:{type: Number, default: 0 },
    // addedAmount: { type: Number, default: 0 },  
    // walletAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
},{timestamps:true})

const WalletModel=new mongoose.model("walletTransaction",walletTransactionSchema);

module.exports=WalletModel;