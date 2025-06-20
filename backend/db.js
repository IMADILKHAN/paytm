const mongoose = require("mongoose"); 
const bcrypt = require('bcrypt')
mongoose.connect("mongodb+srv://blueaadil:JEUWidXg8v05oE7X@cluster0.ovownpl.mongodb.net/");



const userSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true,
    },
    email:{
        type:String,
        required:true, 
        unique:true,
    },
    password:{
        type:String,
        required:true, 
        unique:true,
    }
})


const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
      type:Number,
      required:true  
    }
})

// password encryption before saving
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next(); 
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch(err){
        next(err);
    }
})

// method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema)
module.exports = {User,Account};