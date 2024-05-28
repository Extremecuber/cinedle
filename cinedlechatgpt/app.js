const http = require('http');
const fs = require('fs');

// Read the contents of script.js
const scriptContent = fs.readFileSync('./script.js', 'utf8');

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(scriptContent);
});

// Listen on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const { MongoClient } = require('mongodb');


const uri = 'mongodb://16.171.70.50:27017/Cinedle';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

connectToMongoDB();
