const express = require("express");
const router = express.Router();
const Admin = require("../modules/Admin");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const fetchUser=require('../middleware/fetchUser')
require('dotenv').config()
const jwt=require("jsonwebtoken");
const jwt_secret=process.env.JWT_SECRET

//Create Admin Users
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be alteast 5 characters!").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If error is there then it will return it
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check if same email exist or not
      let email = await Admin.findOne({ email: req.body.email });
      if (email) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists!" });
      }
      const salt=await bcrypt.genSalt(10);
      const securedPass=await bcrypt.hash(req.body.password,salt);
      //Created a new Admin
      user = await Admin.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      });
      const data={
        user:{
            id:user.id
        }
      }
      const authtoken=jwt.sign(data,jwt_secret);
      return res.json({authtoken})
      
    //   res.json(user);
    } catch (error) {
        //Catch error and log errors!
        console.error(error.message)
        return res.status(500).send("Opps! Somthing wrong happened!");
        
    }
    // res.json(user);
    // res.send(req.body);
    // console.log(req.body);
  }
);

//Authentication for Admin to Login
router.post(
    "/login",[
    body('email',"Enter a valid Email").isEmail(),
    body("password","Password cannot be blank").exists(),
],async(req,res)=>{

    let success=false;

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email, password}=req.body;
    try {
        let user=await Admin.findOne({email});
        
        if(!user){
          success=false;
        return res.status(400).json({error:"Please try again! Invalid credintials!"})
        }
       
        const passwordComp = await bcrypt.compare(password[0], user.password);

        if(!passwordComp){
          success=false;
            return res.status(400).json({error:"Please try again! Invalid credintials!"})
        }
        const data={
            user:{
                id:user.id
            }
          }
        const authtoken=jwt.sign(data,jwt_secret);
        success=true;
      return res.json({success,authtoken})
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error!");
    
    }
})

//Get Logged in User Details
router.post('/getuser',fetchUser,async(req,res)=>{
    try {
        userId=req.user.id;
        const user=await Admin.findById(userId).select("-password") //Get all Data from Logged in user except the Password
        return res.send(user);
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error!");
    
    }
    
})

module.exports = router;
