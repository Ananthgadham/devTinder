const express = require('express');

const app=express();

app.use("/",(req,res)=>{
       res.send('hello Ananth');
})
app.listen(3000,()=>{
    console.log('server is running on port 3000');
});