const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const keys = require("../../config/keys");
const User = require("../../models/User");

router.get('/',async(req,res)=>{
  const users = await User.find();
  res.send(users);
});

router.post("/register", async(req, res) => {
    // Form validation
    const {error} = validateRegister(req.body);
    // Check validation
    if (error) {
      console.log("This",error);
     return res.status(400).json(error);
    }
    let user=await User.findOne({ username: req.body.username });
      if (user) return res.status(400).json({ username: "Username already exists" });
        user = new User({
          username: req.body.username,
          password:req.body.password,
        });

        const salt =await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);

        await user.save();
      
        res.status(200).send(user);
});    


router.post("/login", async(req, res) => {
    // Form validation
  const { error} = validateLogin(req.body);
  // Check validation
  if (error) return res.status(400).json(errors);
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;
  // Find user by username number
  let user=await User.findOne({ username });
      // Check if user exists
  if (!user) return res.status(404).json({ UsernameNotFound: "Username not found" });

  const validPassword=await bcrypt.compare(password,user.password)
  if(!validPassword) return res.status(400).send('Invalid Password.');

  const payload = {
    id:user._id,
    username: user.username,
    role:"User"
  };

  const token = await jwt.sign(payload,keys.secret,{expiresIn:31556926});
  console.log(token);

  res.header('x-auth-token',token).send("Successfully logged in.");
  });

function validateRegister(req){
    const schema = {
        password:Joi.string().min(15),
        username:Joi.string().min(3),
    }
    return Joi.validate(req,schema);
}

function validateLogin(req){
    const schema = {
        username:Joi.string(),
        password:Joi.string()
    }
    return Joi.validate(req,schema);
}
  
module.exports = router;