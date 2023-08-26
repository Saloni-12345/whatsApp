let mongoose = require("mongoose");
let DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>
console.log("connected successfully !!!"))
.catch((err)=>console.log("no connection"));