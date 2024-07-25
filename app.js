const { log, error } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Define the route handler to create a file
app.get('/createFile', (req, res) => {
    // Path to the folder where files will be saved
    const filesFolder = path.join(__dirname, 'files');

    // Ensure that the 'files' folder exists
    if (!fs.existsSync(filesFolder)) {
        fs.mkdirSync(filesFolder);
    }

    // Generate current timestamp for file content
    const currentTimestamp = new Date().toISOString();

    // Generate current date and time for the file name
    const currentDateTime = new Date();
    const formattedDateTime = formatDate(currentDateTime); // Function to format date and time
    const filename = `${formattedDateTime}.txt`;
    const filepath = path.join(filesFolder, filename);

    // Define the file content
    const filecontent = `Current Timestamp: ${currentTimestamp}\n`;

    // Write file to the specified path
    fs.writeFile(filepath, filecontent, (err) => {
        if (err) {
            console.error(`Error creating file: ${err}`);
            res.status(500).json({ error: 'Failed to create file' });
        } else {
            console.log('File created successfully:', filename);
            res.json({ message: 'File created successfully', filename });
        }
    });
});

// Define the route handler to get text files
app.get('/getTextFiles', (req, res) => {
    // Path to the folder where files are saved
    const filesFolder = path.join(__dirname, 'files');

    // Read the files in the 'files' folder
    fs.readdir(filesFolder, (err, files) => {
        if (err) {
            console.error(`Error in reading files: ${err}`);
            res.status(500).json({ error: 'Failed to read files' });
        } else {
            // Filter only text files (.txt extension)
            const textFiles = files.filter(file => file.endsWith('.txt'));

            res.json({ files: textFiles });
        }
    });
});

// Function to format date and time as yyyy-mm-dd_hh-mm-ss
function formatDate(date) {
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    const day = padNumber(date.getDate());
    const hours = padNumber(date.getHours());
    const minutes = padNumber(date.getMinutes());
    const seconds = padNumber(date.getSeconds());
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Function to pad numbers with leading zeros if needed
function padNumber(num) {
    return num.toString().padStart(2, '0');
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
