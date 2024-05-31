const frames = [
    // Hardcoded array of image paths replaced with MongoDB data
];

const correctMovie = 'bramhotsavam';  // Replace with the correct movie title
let currentFrame = 0;
let guesses = 0;
const maxGuesses = frames.length;

function displayFrame(index) {
    const existingFrame = document.getElementById(`frame${index}`);
    if (existingFrame) {
        toggleFrame(index);
        return;
    }

    const frameDiv = document.createElement('div');
    frameDiv.className = 'frame';
    frameDiv.style.backgroundImage = `url(${frames[index]})`;
    frameDiv.id = `frame${index}`;
    if (index !== 0) {
        frameDiv.classList.add('hidden');
    }
    document.getElementById('frames').appendChild(frameDiv);

    if (index === 0) {
        createButton(index);
    }

    document.getElementById('submitGuess').disabled = false; // Enable submit button when showing a new frame
}

function createButton(index) {
    const button = document.createElement('button');
    button.innerText = index + 1;
    button.onclick = () => toggleFrame(index);
    document.getElementById('buttons').appendChild(button);
}

function toggleFrame(index) {
    const frameElements = document.querySelectorAll('.frame');
    frameElements.forEach((frame, i) => {
        frame.classList.toggle('hidden', i !== index);
    });
}

function updateMessage(text, color = '#28a745') {
    const messageElement = document.getElementById('message');
    messageElement.innerText = text;
    messageElement.style.color = color;
}

function makeGuess() {
    const userGuess = document.getElementById('guessInput').value.trim();
    guesses++;

    if (!userGuess) {
        updateMessage('Please enter your guess.', '#ff6f61');
        return;
    }

    if (userGuess.toLowerCase() === correctMovie.toLowerCase()) {
        displayEndGameMessage('Congratulations! You guessed it!', 'brampos.jpg'); // Replace with the actual path to the winning image
        return;
    }

    if (guesses >= maxGuesses) {
        displayEndGameMessage(`Sorry, you've used all your guesses. The correct movie was "${correctMovie}".`, 'brampos.jpg'); // Replace with the actual path to the losing image
        return;
    }

    document.getElementById('guessInput').value = '';

    currentFrame++;
    displayFrame(currentFrame);
    createButton(currentFrame);
    toggleFrame(currentFrame);
    updateMessage(`Incorrect! You have ${maxGuesses - guesses} guesses left.`, '#ff6347'); // Changed to a more visible color
}

function skipFrame() {
    guesses++;
    if (guesses >= maxGuesses) {
        displayEndGameMessage(`Sorry, you've used all your guesses. The correct movie was "${correctMovie}".`, 'brampos.jpg'); // Replace with the actual path to the losing image
        return;
    }
    document.getElementById('guessInput').value = '';
    currentFrame++;
    displayFrame(currentFrame);
    createButton(currentFrame);
    toggleFrame(currentFrame);
    updateMessage(`Frame skipped! You have ${maxGuesses - guesses} guesses left.`, '#ff6347'); // Changed to a more visible color
}

// Function to display the end game message with image
function displayEndGameMessage(message, imagePath) {
    const body = document.body;
    body.innerHTML = ''; // Clear the entire content of the body

    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    messageElement.style.color = '#28a745'; // Success color
    messageElement.style.fontSize = '2em';
    messageElement.style.marginTop = '20px';

    const imageElement = document.createElement('img');
    imageElement.src = imagePath;
    imageElement.alt = 'End Game Image';
    imageElement.style.width = '50%'; // Adjust as needed
    imageElement.style.height = 'auto'; // Maintain aspect ratio
    imageElement.style.marginTop = '20px';

    body.appendChild(messageElement);
    body.appendChild(imageElement);
}

window.onload = () => {
    loadImagesFromMongoDB();
    updateMessage('Guess the Movie!');
};

const { MongoClient } = require('mongodb');

const uri = 'mongodb://livehost:27017/Cinedle'; // Replace with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db().collection('images').find().toArray(); // Fetch all images from MongoDB
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        return []; // Return empty array if connection fails
    }
}

async function getImagesFromMongoDB() {
    try {
        const images = await connectToMongoDB();
        return images.map(image => image.path); // Assuming each image document has a 'path' field with the image path
    } catch (err) {
        console.error('Failed to fetch images from MongoDB', err);
        return [];
    }
}

// Use this function to get images from MongoDB and pass them to frames array
async function loadImagesFromMongoDB() {
    const fetchedFrames = await getImagesFromMongoDB();
    frames.push(...fetchedFrames);
    displayFrame(currentFrame); // Display the first frame after images are loaded
}
