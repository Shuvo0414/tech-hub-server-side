const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vp3liji.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // productscollection
    const productsCollection = client.db("productDB").collection("product");
    // brand collection
    const brandNameCollection = client
      .db("productDB")
      .collection("brandNameCollection");

    //   cartCollection
    const cartCollection = client.db("productDB").collection("cartCollection");

    //  get brandscollection
    app.get("/brands", async (req, res) => {
      const cursor = brandNameCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get brand products
    app.get("/products/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      console.log("Received request for brand:", brandName);
      const cursor = productsCollection.find({ brandname: brandName });
      const result = await cursor.toArray();
      res.send(result);
    });

    // get to cartCollection
    app.get("/addToCart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post("/addToCart", async (req, res) => {
      const addCartProduct = req.body;
      console.log(addCartProduct);
      const result = await cartCollection.insertOne(addCartProduct);
      res.send(result);
    });

    // upadte a products
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProducts = req.body;
      const products = {
        $set: {
          photo: updatedProducts.photo,
          name: updatedProducts.name,
          brandname: updatedProducts.brandName,
          type: updatedProducts.type,
          price: updatedProducts.price,
          rating: updatedProducts.rating,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        products,
        options
      );
      res.send(result);
    });

    app.delete("/addToCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 10 sever is running");
});

app.listen(port, () => {
  console.log(`Assignment 10 server is running on port: ${port}`);
});
