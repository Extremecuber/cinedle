const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();
const httpPort = process.env.HTTP_PORT || 3000; // Default HTTP port
//const httpsPort = process.env.HTTPS_PORT || 443; // Default HTTPS port

const uri = 'mongodb://localhost:27017'; // Connection string
const dbName = 'Cinedle'; // Replace with your database name

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit process with a failure code
    }
}

connectToMongoDB();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create HTTP server
const httpServer = http.createServer(app);
httpServer.listen(httpPort, () => {
    console.log(`HTTP Server running on port ${httpPort}`);
});

// Optional: Create HTTPS server (requires SSL certificate)
/*
const options = {
    key: fs.readFileSync('ssl/private.key'),
    cert: fs.readFileSync('ssl/certificate.crt')
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server running on port ${httpsPort}`);
});
*/
