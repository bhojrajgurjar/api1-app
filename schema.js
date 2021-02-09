const mongoose =  require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    name:String,
    age:String,
    aadress:String,
    email:String,
    phoneNumber:Number,
    dateOfBirth:Date
},{collection:"Friend"});

const Friend = mongoose.model("Friend",friendSchema);

module.exports = Friend;