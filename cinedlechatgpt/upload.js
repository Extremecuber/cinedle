const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const filesToUpload = [
    'bramhotsavam1.png',
    'bramhotsavam2.png',
    'bramhotsavam3.png',
    'bramhotsavam4.png',
    'bramhotsavam5.png',
    'bramhotsavam6.png',
    'brampos.jpg',
    // Add more file paths as needed
];

async function uploadFiles(filePaths) {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db('Cinedle');
        const bucket = new GridFSBucket(database);

        for (const filePath of filePaths) {
            await new Promise((resolve, reject) => {
                const fileStream = fs.createReadStream(filePath);
                const uploadStream = bucket.openUploadStream(path.basename(filePath));

                fileStream.pipe(uploadStream)
                    .on('error', (error) => {
                        console.error('Error uploading file:', error);
                        reject(error);
                    })
                    .on('finish', () => {
                        console.log('File uploaded successfully:', path.basename(filePath));
                        resolve();
                    });
            });
        }
        await client.close();

    } catch (err) {
        console.error(err);
        await client.close();
    }
}

// Replace 'your-image-file.jpg' with the path to your image file
uploadFiles(filesToUpload);
