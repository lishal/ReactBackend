const express = require("express");
const connectMongose=require("./db")
var cors=require('cors')
const app=express();

connectMongose();
app.use(cors())
app.use(express.json());
app.listen(5000,function(){
    console.log("Server started!");
})


//Available Routes

app.use("/api/auth", require('./routes/auth'));
app.use("/api/member", require('./routes/memberRoute'));