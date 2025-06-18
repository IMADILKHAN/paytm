const express = require("express");
const User = require("./db");
const { signupSchema } = require("./validations");

const app = express();

app.use(express.json()); // for parsing JSON bodies;




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

app.get('/signin', async function(req,res){

    const {email,password} = req.body; 
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
    res.json({
        message:"Login Succesfull"
    })
})

app.get("/signup",async function(req,res){
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
        res.status(200).json({
            message:"User registered successfully"
        })
    }
    catch(err){
        console.log(err); 
        res.status(500).json({message:"registration failed"})
    }
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

