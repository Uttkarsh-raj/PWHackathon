const router = require('express').Router();
const bcrypt = require('bcrypt');


router.post("/courses/:uid" , async (req,res)=>{
    try{
        const uid = req.params.uid;
        const resp = await db.collection("users").doc(uid).get();
        if (!resp) {
                  res.status(404).json({err:"User Not Found"});
          }
          else{
           course=resp.data().courses;
           course = course.concat(req.body.course);
          await db.collection("users").doc(uid).update({
            courses:course
          })
            res.status(200).json({message:"Updated Course List"})
             
          }
    }
    catch(err){
        res.status(500).json({error:err});
    }
})

router.put('/:uid' ,async (req,res)=>{
    try{
        const uid = req.params.uid;
        console.log(uid)
        const resp = await db.collection("users").doc(uid).get();
        console.log(resp.data())
        if (!resp.data()) {
            console.log(5)
                  res.status(404).json({err:"User Not Found"});
          }
          else{
            const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
          await db.collection("users").doc(uid).update({
            email:req.body.email,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            password:hashedPass 
          })
            res.status(200).json({message:"Updated User"})
             
          }
    }
    catch(err){
        res.status(500).json({error_message:err});
    }
});



router.delete("/delete/:uid" , async(req,res)=>{
    try{
        const response = await db.collection("users").doc(req.params.uid).delete();
        res.status(200).json({response:response});
    }
    catch(err){
        res.status(500).json({error:err})
    }
})

module.exports=router;