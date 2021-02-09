const { request, response } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Friend = require('./schema')
const queryString = require('querystring');
const { resolve } = require("path");
const { rejects } = require("assert");
const { findOne } = require("./schema");
var nodemailer = require('nodemailer');
const axios = require('axios')

const port = process.env.PORT || 3200;

//using middleware
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://bhojraj:28122000@cluster0.de8q3.mongodb.net/Friend?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then((result) => {
        console.log("conected");
    })
    .catch((err) => {
        console.log("not connected");
        console.log('err ', err)
    })



//creating friendlist

const friendList = [
    { id: "1", name: "Ajay", age: "23" },
    { id: "2", name: "jay", age: "13" },
    { id: "3", name: "Vijay", age: "33" },
    { id: "4", name: "Arun", age: "15" },
    { id: "5", name: "karan", age: "20" },
    { id: "6", name: "kartik", age: "21" }
]

//getting friend list

app.get('/', (req, res) => {
    res.send(friendList)
    console.log(friendList)
})

//getting friend by id

app.get('/getFriendById/:id', (request, response) => {
    const id = request.params.id;
    console.log('id:', id)
    const friend = friendList.filter((items) => items.id === id);
    response.json(friend)
    console.log('friend:', friend);

})

//adding friend
const checkAge = (req,res,next)=>{
    const age = req.body.age
    if(age >= '18'){
        next()
    }
    else{
       res.json("Age must be 18 or above 18")
    }
}
app.post('/addFriendTolist',checkAge ,async(request,response)=>{
    try {
        const data = request.body;
        const isExist = await Friend.findOne({email:data.email});
        if(isExist){
            response.status(404).json("User already exist")
        }
        else{
            const newStudent = new Friend(data);
            newStudent.save();
            response.status(201).json(newStudent)
        }
    } catch (err) {
        console.log('err ',err)
    }
});

//get friend by name 

app.get('/getfriendbyname/:name:id', (req, res) => {
    const name = req.params.name
    console.log('name:', name)
    const friend = friendList.filter((items) => items.name == name)
    res.json(friend)
    console.log('friend:', friend)
})

//getting friend from db

app.get("/getFriendsFromDb", (request, response) => {
    Friend.find((err, Friend) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Friend", Friend);
            response.json(Friend)
        }
    })
})

//getiing friend from db by  id

app.get("/getFriendsFromDbById/:id", (request, response) => {
    const id = request.params.id;
    console.log('id:', id)
    Friend.findById(id, (err, Friend) => {
        if (err) {
        
        console.log( "err", err)
        }
        else {
            console.log("Friend", Friend);
            response.json(Friend)
        }
    })
})

//neew-way

app.get("/getFriendsFromDbByname", async (request, response) => {
    const name = request.body;
    console.log('name : ', name)
    const singleFriend = await Friend.findOne(name);
    response.json(singleFriend);
    console.log(singleFriend);
})

//filterByAge

app.get("/getFriendsFromDbByUsingAgeFilter", async (request, response) => {
    const age = request.query.age;
    console.log('age : ', age)
    const singleFriend = await Friend.findOne(age, (err, result) => {
        if (age > 20) {
            response.json(Friend);
        }
        else {
            console.log(err)
           
            console.log("🚀 ~ file: new.js ~ line 148 ~ singleFriend ~ err", err)
            console.log(" err", err)
        }
    });

    console.log(singleFriend);
})


app.get('/new', async function (req, res) {

    // Access the provided 'page' and 'limt' query parameters
    let age = req.query.age;
    let articles = await Friend.find(age)


    // Return the articles to the rendering engine
    res.json(articles)
    console.log(articles)
});

//sending mail

app.get("/sendmail",(req,res)=>{
   

var transporter = nodemailer.createTransport({
    
  service: 'gmail',
  auth: {
    user: 'bgurjar2000@gmail.com',
    pass: process.env.PASS
  }
});

var mailOptions = {
  from: 'bgurjar2000@gmail.com',
  to: 'hemrajg8245@gmail.com',
  subject: 'Sending Email using Node.js practise sir',
  text: ' sir aaya kya mail !'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
})


//accesing third party API

app.get("/getWeatherUpdate/:place",async(request,response)=>{
    const place = request.params.place;
    try {
        const result = await axios.get(
            `http://api.weatherstack.com/current?access_key=9b1624600742cdef609a17cdebd6ceee&query=${place}`
        );
        response.json(result.data)
    } catch (error) {
        console.log(`error`, error)
        console.log('err ',err);
    }
})



app.listen(port, () => {
    console.log(`server is fully up on to port ${port}`)
})