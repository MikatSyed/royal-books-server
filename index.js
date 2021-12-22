const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID
require('dotenv').config()

const port = 5000

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.du7xt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log("connection",err);
  const bookCollection = client.db("royalBooks").collection("books");
  const ordersCollection = client.db("royalBooks").collection("orders");
  console.log("db connected successfully");

  app.get('/booking',(req, res)=>{
    console.log("Hurry!");
    ordersCollection.find({ orderOwnerEmail : req.query.email })
    .toArray((err,result)=>{
      res.send(result)
  })
  })
//send order data in batabase
app.post('/addOrder',(req, res)=>{
  const order = req.body;
  ordersCollection.insertOne(order)
  .then(result=>{
    // console.log(result.acknowledged);
    res.send(result.acknowledged)
  })
})


//get all data from database
  app.get('/allBooks',(req, res)=>{
    const search = req.query.search;
    console.log(search);
    bookCollection.find({name:{$regex: search}})
    .toArray((err, books)=>{
       res.send(books)
    })
}) 
app.get('/Books',(req, res)=>{
  bookCollection.find()
  .toArray((err, books)=>{
     res.send(books)
  })
}) 
//get specific  data from database
app.get('/book/:id',(req, res)=>{
  const id = ObjectID(req.params.id)
  bookCollection.find({_id:id}).toArray((err,result)=>{
    res.send(result[0])
  })
})

app.delete('/deleteBook/:id',(req, res)=>{
  bookCollection.deleteOne({_id: ObjectID(req.params.id)})
       .then(result=>{
         console.log(result.deletedCount);
           res.send(result.deletedCount>0)
  })





 //send image and data in database
  app.post('/addBook',(req, res) => {
     const newBook = req.body;
     console.log(newBook);
     bookCollection.insertOne(newBook)
     .then(result =>{
      //  console.log(result.insertedCount);
       res.send(result.insertedCount > 0)
     })
  })
  
});


})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})