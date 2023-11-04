const express = require('express');
const cors = require('cors');
const jwt=require('jsonwebtoken')
require('dotenv').config()
const app=express();
const port=process.env.port||5002;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');

//  middleware
 app.use(cors());
 app.use(express.json());



 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtmekud.mongodb.net/?retryWrites=true&w=majority`;
 
 // Create a MongoClient with a MongoClientOptions object to set the Stable API version
 const client = new MongoClient(uri, {
   serverApi: {
     version: ServerApiVersion.v1,
     strict: true,
     deprecationErrors: true,
   }
 });
 
 async function run() {
   try {
     // Connect the client to the server	(optional starting in v4.7)
     await client.connect();
     const serviceCallection=client.db('carDB').collection("service")
     const bookingCallection=client.db('carDB').collection('bookings')

  app.post('/jwt',async(req,res)=>{
    const user=req.body;
    console.log(user)
   const tooken= jwt.sign(user, 'secret', { expiresIn: '1h' });
    res.send(tooken)

  })


     app.get('/service',async(req,res)=>{
        const carsour=serviceCallection.find();
        const result= await carsour.toArray();
        res.send(result)
     })

     app.get('/service/:id',async(req,res)=>{
        const id=req.params.id;
        const query= {_id:new ObjectId(id)}
        const options = {
            
            projection: {  title: 1, price: 1,service_id:1,img:1 },
          };
        
        const result= await serviceCallection.findOne(query ,options);
        res.send(result)
     })


      app.get('/bookings',async(req,res)=>{
        let query={}
        console.log(req.query.email);
        if(req.query?.email){
          query={ email :  req.query.email}
        }
        const result= await bookingCallection.find(query).toArray()
        res.send(result);
      })

     app.post('/bookings',async(req,res)=>{
       const booking=req.body;
      //  console.log(booking)
       const result=await bookingCallection.insertOne(booking);
       res.send(result);
     })

     app.patch('/bookings/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const bookings=req.body;
      console.log(bookings)
      const updater={
        $set :{
         status:bookings.status,
        }
      };
      const result= await bookingCallection.updateOne(query,updater)
      res.send(result)
     })

     app.delete('/bookings/:id',async(req,res)=>{
       const id=req.params.id;
       const query={_id:new ObjectId(id)}
       const result= await bookingCallection.deleteOne(query);
       res.send(result)
     })
     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
    //  await client.close();
   }
 }
 run().catch(console.dir);
 







 app.get("/",(req,res)=>{
    res.send("car doctor is runing")
 })
 app.listen(port,()=>{
    console.log(`car doctor server is runing ${port}`)
 })