const express = require('express'); 
const mongoose = require("mongoose")
const { Account } = require('../db');
const { authMiddleware } = require('../middleware');
const router = express.Router();


router.get("/balance",authMiddleware,async function(req,res){ 
    try{
    console.log(req.body.userId);
    const user_account = await Account.findOne({userId:req.body.userId}); 
    if(!user_account){
        res.send({
            message:"Account not found"
        })
        return 
    }
    res.send({
        balance:user_account.balance
    })
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
})

router.get("/transfer",authMiddleware,async function(req,res){
        // put this whole operation inside an trasaction 
        const session = await mongoose.startSession() 
        session.startTransaction(); 
        const amount = parseInt(req.body.amount); 
        // fetch the accounts within the transaction 
        const account = await Account.findOne({userId: req.body.userId}).session(session); 
        if(!account|| account.balance < amount ){
            await session.abortTransaction(); 
            return res.status(400).json({
                message:"Insufficient balance"
            });
        }
        const toAccounnt = await Account.findOne({userId:req.body.to}).session(session);
        if(!toAccounnt){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Invalid Account"
            });
        }

        // perform the transfer 
        await Account.updateOne({userId: req.body.userId},{$inc:{balance:-amount}}).session(session);
        await Account.updateOne({userId: req.body.to},{$inc:{balance:amount}}).session(session);
        // commit the transaction 
        await session.commitTransaction();

        res.json({
            message:"Transfer successful"
        })
})

module.exports = router