    
    const jwt=require('jsonwebtoken');
    const User=require("../models/user");
    // const auth=(req,res,next)=>{
    //     const token='xyz';
    //     if(token!=='xyz'){
    //         res.status(401).send("you are not authorized");
    //     }
    //     else{
    //         next();
    //     }
    // }


    // const userauth=(req,res,next)=>{
    //     const token='user';
    //     if(token!=='xyz'){
    //         res.status(401).send("you are not authorized");
    //     }
    //     else{
    //         next();
    //     }
    // }



    const auth=async (req,res,next)=>{
        try
        {
        const {token}=req.cookies;
        if(!token)
            {
                return res.status(401).send("please login");
            }
        const decodedmessage=await jwt.verify(token,"DEV@TINDER");
        const {_id}=decodedmessage;
        const user=await User.findById(_id);
        if(!user)
        {
            throw new Error("User not found");
        }
        req.user=user;
        next();
    } catch(err)
    {
        res.status(401).send(err.message);
    }
}




    module.exports={auth};