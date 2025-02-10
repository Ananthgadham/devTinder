    
    const auth=(req,res,next)=>{
        const token='xyz';
        if(token!=='xyz'){
            res.status(401).send("you are not authorized");
        }
        else{
            next();
        }
    }


    const userauth=(req,res,next)=>{
        const token='user';
        if(token!=='xyz'){
            res.status(401).send("you are not authorized");
        }
        else{
            next();
        }
    }



    module.exports={auth,userauth};