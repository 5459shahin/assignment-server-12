const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5wiv6.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    // console.log('database connected')
    const serviceCollection = client.db('assignment').collection('services');
    const userCollection = client.db('assignment').collection("users");
    const postCollection = client.db('assignment').collection("user");
    const orderCollection = client.db('assignment').collection("order");
    const reviewCollection = client.db('assignment').collection("review");



    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);

    });



    //update
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await serviceCollection.insertOne(newProduct);
      res.send(result);
    })

    //purchase
    app.get('/purchase/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      console.log('ok');
      res.send(result);
      // console.log(req);
    });

    // store new user email
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);

    });

    // profile
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const user = await postCollection.insertOne(newUser);
      res.send(user);
    })

    // review
    app.post('/reviews', async (req, res) => {
      const newProduct = req.body;
      const review = await reviewCollection.insertOne(newProduct);
      res.send(review);
  })

  // get reviews
  app.get('/reviews', async (req, res) => {
    const query = {};
    const authorization = req.headers.authorization;
    console.log('auth header', authorization);
    const cursor = reviewCollection.find(query);
    const review = await cursor.toArray();
    res.send(review)
})






    // my orders
    app.get('/order/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray()
      res.send(result)
    });

    //delete
    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    })

  }
  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('get START ASSIGNMENT 12')
})

app.listen(port, () => {
  console.log(`assignment app listening on port ${port}`)
})