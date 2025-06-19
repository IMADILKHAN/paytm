const express = require("express");
const cors = require("cors");
const User = require("./db");
const { signupSchema } = require("./validations");
const mainRouter = require("./routes/index");
const app = express();
app.use(cors()); // for adding cors
app.use(express.json()); // for parsing JSON bodies;




app.use("/api/v1",mainRouter);



app.get("/",function(req,res){
    const newUser = new User({
        name: 'Adil',
        email: 'adil1@example.com',
        password:'YOYOadil'
      });
      
      newUser.save()
        .then(() => console.log('User saved!'))
        .catch((err) => console.error('Error:', err));
    res.json({
        msg:"Authenticated"
    })
})





app.put("/editProfile",async function(req,res){
    const {name,email,password} = req.body; 
    try{
        const user = await User.findOne({email});
        if(!user){
                res.json({message:"User not found"})
            }

        if(name){
            user.name = name 
            }
        if(email){
            user.email = email
        }
        if(password){
            user.password = password
        }
        await user.save();
        res.json({
            message:"User Updated"
        })
    }
    catch(err){
        res.status(500).json({
            message:"Update Failed", 
            error:err.message
        })
    }

});


app.listen(3000)

