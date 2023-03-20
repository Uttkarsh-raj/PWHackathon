const router = require('express').Router();
const  {v4: uuidv4} = require("uuid");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const secretKey = "secret";

const db = require('../db/conn');

//AUTH ROUTE
router.post('/signup' ,async (req,res)=>{
    try{
        const {email,firstName,lastName,password} = req.body;
        const querySnapshot = await db.collection("users").where('email', '==', `${email}`).get();
         if (!querySnapshot.empty) {
                   res.status(409).json({err:"Already Exists!"});
           }
           else{
              const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        const uid = uuidv4();
        const userJson = {
            uid:uid,
            email:email,
            firstName:firstName,
            lastName:lastName,
            password:hashedPass,
            courses:[]
        };
        const response =await db.collection('users').doc(userJson.uid).set(userJson);
        res.status(200).json({message:response});
           }
      
    }
    catch(err){
        res.status(500).json({error_message:err});
    }
});


//LOGIN ROUTE
router.post('/login' ,async (req,res)=>{
    try{
        const {email,password} = req.body;
        const response =await db.collection('users').where('email' , '==' ,`${email}`).get();
        let responseARR=[];
          response.forEach(doc=>{
            responseARR.push(doc.data());
          });
        if(responseARR[0] && await bcrypt.compare(password , responseARR[0].password)){
            console.log('hello')
            const token =  jwt.sign({   // syncronously using the jwt key
                email: responseARR[0].email,
                id:responseARR[0].uid
            },
            secretKey,
            {
                expiresIn: '1h'
            });
            res.status(200).json({message:"Login Successful",token:token});
        }
        else{
            res.status(401).json("Auth Failed");
        }
       
    }
    catch(err){
        res.status(500).json({error_message:err});
    }
});

module.exports = router;