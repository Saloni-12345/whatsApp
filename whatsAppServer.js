let express = require("express");
let dotenv = require("dotenv")
let jwt = require("jsonwebtoken");
let { Strategy, ExtractJwt} = require("passport-jwt");
let passport = require("passport");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods",
 "GET,POST,PUT,PATCH,OPTIONS,DELETE,HEAD");
 res.header("Access-Control-Allow-Headers",
 "Origin,X-Requested-With,Content-Type,Accept,Authorization");
 next();
});
app.use(passport.initialize());
dotenv.config({path:"./config.env"});
require("./db/conn");
let port = process.env.PORT|| 2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

let { User ,Message} = require("./model/useSchema")
let { users } = require("./userdata");

let params = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : "jwtKey12345"
}
let jwtExpirySecond = 86400;

let strategyAll = new Strategy(params,async function(token,done){
 console.log("In Strategy All", token);
 let user = await User.findOne({_id : token.id});
 if(!user) return done(null, false, {message: "Incorrect email Address"});
 else return done( null, user)
});
passport.use("roleAll", strategyAll);

app.get("/reset",async (req,res)=>{
 try{
   let data = await User.insertMany(users);
   res.send(data);
   console.log("Successfully Inserted !!!");
 }catch(err){
    res.status(500).send(err)
 }
})
app.get("/",(req,res)=>{
  res.send("Welcome to Web WhatsApp....");
})

app.post("/login", async (req,res)=>{
 let email = req.body.email;
 let user = await User.findOne({email: email});
 console.log(user)
 if(!user) res.status(404).send({error: "Incorrect Email Address"});
 else{
    let payload = { id: user._id}
    let token = jwt.sign(payload, params.secretOrKey,{
        algorithm:"HS256",
        expiresIn: jwtExpirySecond
    });
     let data = await User.findOneAndUpdate({email: email},{ status: true })
    res.send({token : "bearer "+ token});
 }
})
app.get("/getUsers",passport.authenticate("roleAll",{session:false}), async (req,res)=>{
try{
    let data = await User.find({email: { $ne: req.user.email }});
    res.send(data);
}catch(err){
    res.status(500).send(err);
}
})
app.get("/user", passport.authenticate("roleAll",{session: false}), (req,res)=>{
    res.send(req.user)
})
app.post("/logout", async (req,res)=>{
    let date = new Date();
    let dayDate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    console.log(dayDate);
    let timeData = date.getHours()+":"+date.getMinutes();
    console.log(timeData);
    let email = req.body.email;
    await User.findOneAndUpdate({email: email},{  logoutData:{date:dayDate ,time:timeData}, status: false})
    res.send(await User.findOne({email: email}));
})
app.post("/messages", passport.authenticate("roleAll",{session: false}), async (req,res)=>{
  let user = req.user;
  let email = req.body.email;
  let data = await Message.find();
  let data1 = data.filter((d1)=>(d1.to==email && d1.from==user.email )||(d1.to==user.email&& d1.from==email ) )
   res.send(data1);
})
app.put("/messages", passport.authenticate("roleAll",{session: false}), async (req,res)=>{
 let user = req.user;
 let body = req.body;
 let data = new Message(body)
 let data1 = await data.save(); 
 console.log(data1);
 res.send(await Message.find({ to : body.to, from: user.email}));
})