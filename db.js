const mongoose = require('mongoose');
require('dotenv').config()
const url = process.env.URL;
const connectToMongo=()=>{
    mongoose.connect(url,()=>{
        console.log("Mongoose is Connected!")
    })
}
module.exports=connectToMongo;