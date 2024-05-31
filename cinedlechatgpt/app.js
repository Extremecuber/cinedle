const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uri = 'mongodb://localhost:27017';  // Connection string
const dbName = 'Cinedle';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}

connectToMongoDB();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/connect-to-mongodb', async (req, res) => {
    try {
        if (!db) await connectToMongoDB();
        res.status(200).send('Connected to MongoDB');
    } catch (error) {
        res.status(500).send('Failed to connect to MongoDB');
    }
});

app.get('/get-images', async (req, res) => {
    try {
        const collections = await db.listCollections().toArray();
        const randomCollection = collections[Math.floor(Math.random() * collections.length)].name;
        const images = await db.collection(randomCollection).find().toArray();
        const imagePaths = images.map(image => image.path); // Assuming each image document has a 'path' field

        res.json({ correctMovie: randomCollection, frames: imagePaths });
    } catch (err) {
        console.error('Failed to fetch images from MongoDB', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
