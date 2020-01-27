//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var encrypt = require("mongoose-encryption")

mongoose.connect("mongodb://localhost:27017/secretsDB",{useNewUrlParser:true,useUnifiedTopology:true});

// let encKey = process.env.SOME_32BYTE_BASE64_STRING;
// let signInKey = process.env.SOME_32BYTE_BASE64_STRING;
const sec = "Thisisarandomtext";


const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

const usersSchema = new mongoose.Schema({
  emailId: String,
  password:String
});


usersSchema.plugin(encrypt,{secret:sec,encryptedFields:['password']});

const User = mongoose.model("User",usersSchema);




app.get("/",function(req,res){
  res.render("home");
});



app.route("/login")
.get(function(req,res)
{
  res.render("login");
})

.post(function(req,res){
  let userna = req.body.username;
  let passwd = req.body.password;
  User.findOne({emailId:userna},function(err,results){

    if(err){
       res.send(err)
    }
    else
    { if(results){
      if(results.password===passwd)
      {
        console.log("found");
        res.render("secrets");
      }
    }
  }
  });
});



app.route("/register")

.get(function(req,res)
{
  res.render("register");
})

.post(function(req,res){
  let email = req.body.username;
  let passwd = req.body.password;
  const details = new User({
    emailId:email,
    password:passwd
  });
  details.save(function(err){
    if(err){
      res.send(err);
    }else {
      res.render("secrets");
    }
  });
});


app.listen(8080,function(req,res){
  console.log("Listening");
});
