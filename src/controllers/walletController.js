const  WalletModel =require("../models/wallet")

const addWallet = async (req, res) => {
   try {
       const { serviceCenterName } = req.body;

       // Check if the spare part name already exists
       const existingserviceCente = await WalletModel.findOne({ serviceCenterName });
       if (existingserviceCente) {
           return res.json({ status: false, msg: "Service Center already exists in Wallets" });
       }

       // If not, proceed to add the new spare part
       const data = new WalletModel(req.body);
       await data.save();
       res.json({ status: true, msg: "Wallet Added" });
   } catch (err) {
       res.status(400).send(err);
   }
};


const getAllWallet=async(req,res)=>{
    try{
        let data=await WalletModel.find({}).sort({ _id: -1 });
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}
const getWalletById=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await WalletModel.findById(_id);
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}
const getWalletByCenterId = async (req, res) => {
    try {
      let serviceCenterId = req.params.id;
      let data = await WalletModel.findOne({ serviceCenterId: serviceCenterId });
      if (!data) {
        return res.status(404).send({ message: "Wallet not found" });
      }
      res.send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  }
  
const editWallet=async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let data=await WalletModel.findByIdAndUpdate(_id,body);
        res.json({status:true,msg:"Wallet Updated"});
     }catch(err){
        res.status(500).send(err);
     }
}
 const deleteWallet=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await WalletModel.findByIdAndDelete(_id);
        res.json({status:true,msg:"Wallet Deteled"});
     }catch(err){
        res.status(500).send(err);
     }
 }

module.exports = { addWallet,getAllWallet,getWalletById,getWalletByCenterId,editWallet,deleteWallet };
