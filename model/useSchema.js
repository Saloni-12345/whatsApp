let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    name : {
        type: String,
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    about:{
        type:String
    },
    status: {
        type: Boolean,
        required: true
    },
    logoutData:{
        type: Object,
        required: true
    },
})
const messageSchema = new mongoose.Schema({
   from:{
     type: String,
     required: true
   },   
    to:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    }
})
const User = mongoose.model('USER', userSchema);
const Message = mongoose.model('MESSAGE', messageSchema);
module.exports = { User,Message };