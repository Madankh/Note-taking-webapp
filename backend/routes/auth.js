const router = require("express").Router();
const User = require('../Schema/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")

// Create a User account
router.post('/createUser' ,[
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async(req , res)=>{
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json("Email has been already register");
    }

    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password , salt);

     user = await User.create({
        name:req.body.name,
        password:secpass,
        email: req.body.email
    })

    const data = {
        user:{
            id  : user.id
        }
    }
    const authtoken = jwt.sign(data , process.env.JWT_SEC);
    console.log(authtoken);

    res.status(200).json(authtoken)
})

//Login User
router.post("/login" , [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async(req , res)=>{
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {email , password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(200).json("Please try to login with correct credential")
        }
    
        const passwordcompare = await bcrypt.compare(password , user.password);
        if(!passwordcompare){
            res.status(400).json("Invalid password");
        }
    
        const data = {
            user:{
                id  : user.id
            }
        }
        const authtoken = jwt.sign(data , process.env.JWT_SEC);
        console.log(authtoken);
    
        res.status(200).json(authtoken)
    
    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
})

///Get User
router.get("/getuser", fetchuser , async (req , res)=>{
    try {
        userid = req.user.id;
        const user = await  User.findById(userid).select("-password");
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal server Error")
    }
})

module.exports = router;