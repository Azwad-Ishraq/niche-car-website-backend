const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axy7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try{
    await client.connect()
    console.log('db connected')


    const database = client.db('chaka')
    const carsCollection = database.collection('cars')
    const ordersCollection = database.collection('orders')
    const usersCollection = database.collection('users')
    const reviewsCollection = database.collection('reviews')
    
    

    app.get('/cars', async (req,res)=>{
      const cursor = await carsCollection.find({})
      const cars = await cursor.toArray()
      res.send(cars)

    })
    app.delete('/cars/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await carsCollection.deleteOne(query)
      res.json(result)
    })
    app.get('/cars/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const car = await carsCollection.findOne(query)
      res.json(car)
    })

    app.post('/orders', async (req,res)=>{
      const order = req.body;
      const result = await ordersCollection.insertOne(order)
      res.json(result)
    })
    app.get('/orders/:email', async (req,res)=>{
      const email = req.params.email;
      const query = {userEmail: email}
      
      const cursor =  ordersCollection.find(query)
      const orders = await cursor.toArray();
      res.send(orders)
    } )

    app.delete('/orders/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await ordersCollection.deleteOne(query)
      res.json(result)
    })
    app.post('/users', async (req,res)=> {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.json(result)
    })
    app.put('/users', async (req,res)=>{
      const user = req.body;
      const filter = {email:user.email}
      const options = {upsert:true}
      const updateDoc = {$set:user}
      const result = await usersCollection.updateOne(filter,updateDoc,options)
      res.json(result)
    })
    

    app.put('/users/admin', async (req,res)=>{
      const user = req.body;
      const filter = {email: user.email}
      const updateDoc = {$set: {role:'admin'}}
      const result = await usersCollection.updateOne(filter,updateDoc)
      res.json(result)
    })
    app.get('/users/:email',async (req,res)=>{
      const email = req.params.email
      const query = {email:email}
      const user = await usersCollection.findOne(query)
      let isAdmin = false
      if(user?.role === 'admin'){
        isAdmin =true;
      }
      res.json({admin: isAdmin})
    })
    app.post('/reviews', async (req,res)=>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review)
      res.json(result)
    })

    app.get('/reviews', async (req,res)=>{
      const cursor =  reviewsCollection.find({})
      const reviews = await cursor.toArray()
      res.send(reviews)
    })
    app.post('/cars', async (req,res)=>{
      const car = req.body;
      const result = await carsCollection.insertOne(car)
      res.json(result)
    })
    app.get('/orders', async (req,res)=>{
      const cursor = ordersCollection.find({})
      const orders = await cursor.toArray()
      res.send(orders)
    })
    app.put('/orders/:id', async (req,res)=>{
      const id = req.params.id;
      console.log(id)
      const updatedOrder = req.body;
      const filter = {_id: ObjectId(id)}
      const options = {upsert: true}
      const updateDoc = {
        $set:{
          userName: updatedOrder.userName,
          car: updatedOrder.car,
          price: updatedOrder.price,
          userEmail: updatedOrder.userEmail,
          status: 'shipped'
        }
      }
      const result = await ordersCollection.updateOne(filter,updateDoc,options)
      res.json(result)

    })
  }
  finally{
    // await client.close()

  }
}
run().catch(console.dir)






app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(` listening at ${port}`)
  })