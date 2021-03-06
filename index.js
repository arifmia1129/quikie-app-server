const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require("express/lib/response");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hpm3z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const collection = client.db("allStock").collection("stock");
        app.get("/stock", async (req, res) => {
            const query = {};
            const result = await collection.find(query).toArray();
            res.send(result);
        })
        app.put("/stock", async (req, res) => {
            const doc = req.body;
            const filter = { id: doc?.id };
            const options = { upsert: true };
            const updateDoc = {
                $set: doc
            };
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        app.delete("/stock/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { id };
            const result = await collection.deleteOne(query);
            res.send(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Server for quikie app!")
})

app.listen(port, () => {
    console.log(`Quikie app listening on port ${port}`);
})