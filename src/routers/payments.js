
const express=require("express");
const router= new express.Router();
const Razorpay=require("razorpay");
const crypto=require("crypto");
const { default: axios } = require("axios");
const NotificationModel = require("../models/notification")
const {UserModel} = require("../models/registration")
const ComplaintModal = require("../models/complaint")
const BankTransactionModel=require("../models/bankTransaction");
 
const fs=require("fs");
require("dotenv");
const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
//const instance = new Razorpay({ key_id: "rzp_live_aOxuRwOwtnZ9v0", key_secret: "Obz13GEJNLLX3Fch2ziVGiA0" });

 
router.post("/payment",async(req,res)=>{
     try{
      const order=await instance.orders.create({
        amount: (+req.body.amount)*100,
        currency: "INR",
      });
      res.send(order);
     }catch(err){
          res.status(400).send(err);
     }
});
router.post("/walletPayment",async(req,res)=>{
    try{
     const pay=await instance.orders.create({
       amount: (+req.body.amount)*100,
       currency: "INR",
     });
     res.send(pay);
    }catch(err){
         res.status(400).send(err);
    }
  });
  
  router.post("/paymentVerificationForUser",async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body.response;
   
    const body=razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");
     
    const isAuthentic=expectedSignature===razorpay_signature;
    
    
    if( isAuthentic){
      try{
       let user=await UserModel.findById(req.body.row.userId);
      
      const notification = new NotificationModel({
        userId: user._id,  
        userName: user.name,
        title: `User Payment`,
        message: `Payment Successfully  , ${req.body.amount} INR!`,
     });
     await notification.save();
       let transaction=new BankTransactionModel({userId:user?._id,userName:user?.name,paidAmount:req.body.amount});
       await transaction.save();
       const complaint = await ComplaintModal.findById(req.body.row._id);
       if (!complaint) {
         return res.status(404).json({ status: false, msg: 'Complaint not found' });
       }
 
       complaint.payment =  req.body.amount;
       await complaint.save();
       res.json({ status: true, msg: "Payment Successfull" });
      }catch(err){
        res.status(400).send(err);
      }
    }else{
      res.status(401).send("Not Authorized");
    }
  });
  
  
  router.get("/getWalletTransaction/:id", async (req, res) => {
    try {
        let id=req.params.id;
        let data = await BankTransactionModel.find({userId:id});
        res.send(data);
    } catch (err) {
        res.status(500).send(err);
    }
  });
  
  router.post("/serviceCenterDuePayment",async(req,res)=>{
        try{
        let body=req.body;
        let response = await axios.post("https://api.razorpay.com/v1/payouts",body,{headers:{Authorization:"Basic " +new Buffer.from(process.env.RAZORPAYX_KEY_ID + ":" +process.env.RAZORPAYX_KEY_SECRET ).toString("base64")}});
        let {data}=response;
        if (data?.entity === "payout") {
          const notification = new NotificationModel({
            serviceCenterId: data?._id,
            
            title: `Service Center  Payment`,
            message: `Payment Successfull, ${req.body.amount} INR!`,
         });
         await notification.save();
        
        }
        res.send(data);
        }catch(err){
         res.status(400).send(err); 
        }
  });

  module.exports=router;