const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());

// AdventureAegis
// KAojr9jvN6G4Vf0x



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mahb0di.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const spotCollection = client.db('spotsDB').collection('spots')
    const countriesCollection = client.db('spotsDB').collection('countries')

    app.get('/spot', async(req, res) => {
      const cursor = spotCollection.find().limit(6)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/spots', async(req, res) => {
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/spots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query)
      res.send(result)
    })

    app.get('/mySpots/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email}
      const result = await spotCollection.find(query).toArray();
      res.send(result)
    })

    app.post('/spots', async(req, res) => {
      const newSpots = req.body;
      console.log(newSpots)
      const result = await spotCollection.insertOne(newSpots)
      res.send(result)
    })

    app.put('/spots/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          name: updatedSpot.name,
          country: updatedSpot.country,
          photo: updatedSpot.photo,
          visitors: updatedSpot.visitors,
          location: updatedSpot.location,
          cost: updatedSpot.cost,
          season: updatedSpot.season,
          time: updatedSpot.time,
          description: updatedSpot.description
        }
      }
      const result = await spotCollection.updateOne(filter, spot, options)
      res.send(result)
    })

    app.delete('/spots/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/countries', async(req, res) => {
      const cursor = countriesCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/countrySpots/:country', async(req, res) => {
      const country = req.params.country;
      const query = {country: country}
      const result = await spotCollection.find(query).toArray();
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Adventure Aegis server is running')
})

app.listen(port, () => {
    console.log(`Adventure Aegis server is running on port: ${port}`)
})