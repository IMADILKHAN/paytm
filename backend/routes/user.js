const express =require('express'); 
const router = express.Router(); 
const zod = require("zod"); 
const {User, Account} = require("../db")
const jwt_secret = require('../config');
const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema } = require('../validations');




router.post('/signin', async function(req,res){

    const {email,password} = req.body; 
    const parseResult = signinSchema.safeParse(req.body);
    if(!parseResult.success){
        return res.status(400).json({
            errors:parseResult.error.flatten().fieldErrors,
        });
    }
    const user = await User.findOne({email}); 
    if(!user){
        return res.status(400).json({
            messsage: "Invalid username or password"
        })
    }
    const isMatch = await user.comparePassword(password); 
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid username or password"
        })
    }
    const token = jwt.sign({
        email
    },jwt_secret.JWT_SECRET)
    res.json({
        message:"Login Succesfull",
        token:token
    })
})


router.post("/signup",async function(req,res){
    const parseResult = signupSchema.safeParse(req.body); 
    if(!parseResult.success){
        return res.status(400).json({
            errors:parseResult.error.flatten().fieldErrors,
        });
    }
    const {name,email,password} = req.body; 
    try{
        const newUser = new User({name,email,password});
        await newUser.save()
        const randomNum = Math.floor(Math.random() * 10000) + 1; 
        const userAccount = new Account({
            userId:newUser._id,
            balance:randomNum
        });
        await userAccount.save();
        const token = jwt.sign({
            email
        },jwt_secret.JWT_SECRET)
        res.status(200).json({
            message:"User registered successfully",
            token:token
        })
    }
    catch(err){
        console.log(err); 
        res.status(500).json({message:"registration failed"})
    }
})







module.exports = router;