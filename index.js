const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 9000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.57jms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("voleenteerdb");
        const eventCollection = database.collection("events");
        const registrationCollection = database.collection("registeruser");
        // post event
        app.post('/events', async (req, res) => {
            const events = req.body;
            const result = await eventCollection.insertOne(events);
            res.json(result)
        })
        // app get
        app.get('/events', async (req, res) => {
            const result = await eventCollection.find({}).toArray();
            res.send(result)
        })
        app.get('/registration/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await eventCollection.findOne(query);
            res.send(result)
        })
        app.post('/registeruser', async (req, res) => {
            const body = req.body;
            const id = { _id: ObjectId(body.id) }
            const resultfind = await eventCollection.findOne(id);
            resultfind.user_name = body.name;
            resultfind.user_email = body.useremail;
            resultfind.user_date = body.date;
            resultfind.user_desc = body.description;
            const result = await registrationCollection.insertOne(resultfind);
            res.json(result)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Running volunteer server`, port)
})