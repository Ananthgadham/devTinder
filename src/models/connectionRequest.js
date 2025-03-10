const mongoose=require('mongoose');
 const connectionRequestschema=new mongoose.Schema({
       fromUserId:
       {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
       },
       toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
       },
       status:{
         type:String,
          enum:["ignore","intrest","accepted"],
          message:'{VALUE} is not supported'
       }
 },{timestamps:true});

      
    connectionRequestschema.index({fromUserId:1,toUserId:1})

      connectionRequestschema.pre("save", function(next){
            const connectionRequest=this;
            if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
            {
                  throw new Error("From and To User Id can't be same");
            }

            next();
      });

 const connectionRequest=mongoose.model("connectionRequest",connectionRequestschema);

 module.exports=connectionRequest;