const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gu8vt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 console.log(uri);
    async function run(){
        try{
        await client.connect();
            console.log('connected to database');
            const database = client.db('carMechanic');
            const serviceCollection = database.collection('services');
            // POST Api for products.to send data to the database
        app.post('/addService', async(req, res)=>{
            const newService = req.body;
            console.log('hit the post api', newService)
            const result = await serviceCollection.insertOne(newService);
            console.log("got new newService", newService) 
            console.log("added newService", result); 
            res.json(result); 
            // res.send('post hitted'); 
        });
        //GET All Products
        app.get('/allServices', async(req, res)=>{
            const cursor = serviceCollection.find({})
            const allServices = await cursor.toArray();
            res.send(allServices)
        });

        //Get Single Service
        app.get('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            console.log("load product with id:", id)
            res.send(service);
            console.log(service);
        });
        //DELETE  API
        app.delete('/allServices/:id', async(req, res) =>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const result = await serviceCollection.deleteOne(query)
        res.json(result)
        });
        // ================
        }
        //try end
        finally{
            // await client.close();
        }
    }//function end
    // function call
run().catch(console.dir);


        





app.get('/', (req, res)=>{
    res.send('Running react app server');
});
app.listen (port, ()=>{
    console.log("Running server on port", port)
})