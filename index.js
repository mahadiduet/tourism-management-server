const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
   res.send('Server side running...')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mahadiduet:EJMEfxwMN9szBmNF@cluster0.lyuai16.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      //  await client.connect();
      const userCollection = client.db("tourismDB").collection("users");
      const tourismCollection = client.db("tourismDB").collection("tourism");

      //  User Create
      app.post('/user', async (req, res) => {
         const data = req.body;
         const result = await userCollection.insertOne(data);
         console.log(`A document was inserted with the _id: ${result}`);
         res.send(result);
      })

      // View Tourism spot
      app.get('/tourism-sport', async (req, res) => {

         const data = await tourismCollection.find().sort({ _id: -1 }).limit(6).toArray();
         // const data = cursor.toArray();
         res.send(data);
      })

      // All tourism spot
      app.get('/all-tourism-sport', async (req, res) => {

         const data = await tourismCollection.find().sort({ _id: -1 }).toArray();
         // const data = cursor.toArray();
         res.send(data);
      })

      // My Added spot 
      app.get('/my-tourism-sport', async (req, res) => {
         const email = req.query.email;
         const data = await tourismCollection.find({ 'user_email': email }).sort({ _id: -1 }).toArray();
         res.send(data);
      })

      // View details spot 
      app.get('/view-details', async (req, res) => {
         const id = new ObjectId(req.query.id);
         console.log(id);
         const data = await tourismCollection.find({ '_id': id }).toArray();
         console.log(data)
         res.send(data);
      })

      // Update Spot 
      app.get('/update', async (req, res) => {
         const id = new ObjectId(req.query.id);
         console.log(id);
         const data = await tourismCollection.find({ '_id': id }).toArray();
         console.log(data)
         res.send(data);
      })

      // Delete tourism
      app.delete('/my-tourism-sport/:id', async (req, res) => {
         const tourism_id = new ObjectId(req.params.id);
         // console.log(tourism_id);
         const query = {_id: tourism_id};
         const result = await tourismCollection.deleteOne(query);
         res.send(result);
      });

      // Add tourism spot
      app.post('/add-tourism-sport', async (req, res) => {
         const tourism = req.body;
         console.log(tourism);
         const result = await tourismCollection.insertOne(tourism);
         console.log(`A document was inserted with the _id: ${result}`);
         res.send(result);
      })

      // Single tourism get
      app.get('/all-tourism-sport/:id', async(req, res)=>{
         const id = req.params.id;
         const query = new ObjectId(id);
         const result = await tourismCollection.findOne(query);
         res.send(result);
      })

      // Update tourism spot
      app.put('/update-tourism-spot/:id', async (req, res) => {
         const id = req.params.id;
         // console.log(id);
         const filter = { _id: new ObjectId(id) };
         const options = { upsert: true };
         const updateData = {
            $set: req.body
          };
         // const tourism = req.body;
         // console.log(tourism);
         const result = await tourismCollection.updateOne(filter, updateData, options);
         // const result = await tourismCollection.insertOne(tourism);
         console.log(`A document was inserted with the _id: ${result}`);
         res.send(result);
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


app.listen(port, () => {
   console.log('Server site port run:', port);
})