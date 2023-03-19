const router = require('express').Router();
const  {v4: uuidv4} = require("uuid");
const bcrypt = require('bcrypt');

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
        if(response && await bcrypt.compare(password , responseARR[0].password)){
            res.status(200).json("Login Successful");
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