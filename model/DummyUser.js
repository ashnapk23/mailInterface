const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const DummyUserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:"5m"
    }
});
module.exports=mongoose.model("DummyUser",DummyUserSchema)