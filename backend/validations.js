const zod = require('zod'); 

const signupSchema = zod.object({
    name: zod.string(),
    email:  zod.string().email("Invalid Email"), 
    password:   zod.string().min(6,"password must be atleast 6 charachters")
});

module.exports = {signupSchema}