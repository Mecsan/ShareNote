const mongo = require("mongoose");

mongo.connect(process.env.MONGO_CONNECT,(err,res)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("data base connected");
})