const mongoose = require('mongoose');
require('dotenv').config();
const MONGO = process.env.MONGO_URL;

const connectDB = async () =>{
    try{
        await mongoose.connect(MONGO);
        console.log("DB Connected")
    }
    catch(err){
        console.error(err);
    }
}

module.exports = connectDB;

