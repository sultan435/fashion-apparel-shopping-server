const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdscwoz.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db("fashionProducts").collection("allProducts")
    const addCartCollection = client.db("fashionProducts").collection("addCart")

    app.get("/products/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    // all  product post operation
    app.post("/products", async(req, res) =>{
      const data = req.body;
      console.log(data)
      const result = await productCollection.insertOne(data)
      res.send(result)
    })

    app.put("/products/:id", async(req, res) =>{
      const id =req.params.id;
      const filter ={ _id: new ObjectId(id)}
      const options = { upsert: true };
      const productInfo = req.body;
      const updateDoc = {
        $set:{
          name: productInfo.name,
          brandName: productInfo.brandName,
          price: productInfo.price,
          type: productInfo.type,
          image: productInfo.image,
          description: productInfo.description
        }
      }
      const result = await productCollection.updateOne(filter,updateDoc,options)
      res.send(result)

    })
    //all product get operation
    app.get("/products", async(req, res) =>{
      const result = await productCollection.find().toArray()
      res.send(result)
    })

    // cart products store
    app.post("/store", async(req, res) =>{
      const data = req.body;
      console.log(data)
      const result = await addCartCollection.insertOne(data)
      res.send(result)
    })
    //delete products
    app.delete("/store/:id", async(req, res) =>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await addCartCollection.deleteOne(query)
      res.send(result)
    })

    app.get("/store", async(req, res) =>{
      const result = await addCartCollection.find().toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) =>{
    res.send("FASHION AND APPAREL SERVER IS up and RUNNING")
})

app.listen(port, () =>{
    console.log(`FASHION and apparel server is running port : ${port}`);
})