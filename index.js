const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkjat.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });



client.connect(err => {
  const volunteerLists = client.db("volunteerNetwork").collection("activities");
  const userList = client.db("volunteerNetwork").collection("users");
  app.post('/volunteerList',(req, res)=> {
    const volunteerList = req.body;
    volunteerLists.insertMany(volunteerList)
    .then(result=>{
      // console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

  app.get('/allEvent', (req,res) => {
    volunteerLists.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })


  app.get('/event/:id', (req, res) => {
    volunteerLists.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })


  app.post('/addUser', (req, res) => {
    const user = req.body;
    userList.insertOne(user)
    .then(result => {
      res.send(result)
      
    })
  })


  app.get('/userInfo', (req, res) => {
    console.log("hi");
    userList.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })


  app.get('/registerUserList', (req, res) => {
    userList.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })



  app.delete('/deleteUser/:id', (req, res) => {
    userList.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      // console.log(result);
      res.send(result.deletedCount > 0);
    })
  })
  
});



app.listen(process.env.PORT || 4000)