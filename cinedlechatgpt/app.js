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
