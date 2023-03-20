const router = require('express').Router();
const db = require("../db/conn");
const check_auth = require('../middleware/check_auth');


router.get("/all" ,async (req,res)=>{
    try{
        const usersRef = db.collection('users');
        const response = await usersRef.get();
        let responseArr= [];
        response.forEach(doc=>{
            responseArr.push(doc.data());
        });

        res.status(200).json({data:responseArr});
    }
    catch(err){
        res.status(500).json({error:err});
    }
});

router.get("/" ,check_auth, async (req,res)=>{
        const user = req.body.email
          const usersRef =  db.collection("users")
          const response = await usersRef.where('email','==',`${user}`).get();
          let responseARR=[];
          response.forEach(doc=>{
            responseARR.push(doc.data());
          });
          res.status(200).json({data:responseARR});

})

module.exports = router