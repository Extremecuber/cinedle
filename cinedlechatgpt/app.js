// const http = require('http');
// const fs = require('fs');

// // Read the contents of script.js
// const scriptContent = fs.readFileSync('./script.js', 'utf8');

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/javascript'});
//     res.end(scriptContent);
// });

// // Listen on port 3000
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// const { MongoClient } = require('mongodb');


// const uri = 'mongodb://16.171.70.50:27017/Cinedle';

// const client = new MongoClient(uri);

// async function connectToMongoDB() {
//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');
//     } catch (err) {
//         console.error('Failed to connect to MongoDB', err);
//     }
// }

// connectToMongoDB();

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uri = 'mongodb://localhost:27017';  // Connection string
const dbName = 'Cinedle';        // Replace with your database name

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);  // Exit process with a failure code
    }
}

connectToMongoDB();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

