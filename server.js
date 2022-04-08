const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./Develop/db/db.json');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// Initialize the app and create a PORT
const app = express();
const PORT = 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html')
    )
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')
    )
);

// GET request for notes
app.get('/api/notes', (req, res) => {
    //Send a message to the client 
    res.json(`${req.method} request received to get notes`);

    // log our request to the terminal
    console.log(`${req.method} request received to get notes`)
});

app.get('/api/notes/:note_id', (req, res) => {
    if(req.body && req.params.note_id) {
        console.log(`${req.method} request received to get a single note`);
        const noteId = req.params.note_id;
        for(let i = 0; i < notes.length; i++) {
            const currentNote = notes[1];
            if(currentNote.note_id === noteId) {
                res.json(currentNote);
                return;
            }
        }
        res.json('Note ID not found');
    }
});



app.listen(PORT, () => 
console.log(`App listening at http://localhost:${PORT}`)
)