const StockModal =require("../models/stock")

const addStock  = async (req, res) => {
  
        try{
            let body=req.body;
            let data=new StockModal(body);
            await data.save();
            res.json({status:true,msg:"Stock   Added"});
        }catch(err){
            res.status(400).send(err);
        }
 
};

const getAllStock=async(req,res)=>{
    try{
        let data=await StockModal.find({}).sort({ _id: -1 });
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}
const getStockById=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await StockModal.findById(_id);
        res.send(data);
     }catch(err){
        res.status(400).send(err);
     }
}

const editStock=async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let data=await StockModal.findByIdAndUpdate(_id,body);
        res.json({status:true,msg:"Stock Updated"});
     }catch(err){
        res.status(500).send(err);
     }
}
 const deleteStock=async(req,res)=>{
    try{
        let _id=req.params.id;
        let data=await StockModal.findByIdAndDelete(_id);
        res.json({status:true,msg:"Stock Deteled"});
     }catch(err){
        res.status(500).send(err);
     }
 }

module.exports = { addStock,getAllStock,getStockById,editStock,deleteStock };