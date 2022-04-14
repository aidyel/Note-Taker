const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');

// Helper method for generating unique ids
const uuid = require('uuid/v1');

// Initialize the app and create a PORT
const app = express();
const PORT =  process.env.PORT || 3001;

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
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        let parsedNotes;
        try {
            parsedNotes = JSON.parse(data);
        }
        catch(err) {
            parsedNotes = [];
        }
      
        res.json(parsedNotes);
    });

});

// Get request for a single note
app.get('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        const notesId = JSON.parse(data);

        res.json(notesId.filter((noteId) => noteId.id === req.params.id));
    });

});

// Delete request
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        }
        let notesId = JSON.parse(data);
 
        const deleteId = req.params.id;

        const deleted = notesId.find(note => note.id === deleteId);
        console.log("Note to delete ", deleted)
        if (deleted) {
            notesId = notesId.filter(note => note.id != deleteId);

            fs.writeFile('./db/db.json',
            JSON.stringify(notesId, null, 4),
            (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.log('Successfully deleted notes!')
        );
            res.json({
                ok: true,

            })
        } else {
            res
                .status(404)
                .json({ message: "Note doesn't exist" })
        }
      
    });

})

//  POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was retrieved
    console.log(`${req.text} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        // obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                //  Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                //  Add a new note
                parsedNotes.push(newNote);

                //  Write updated notes back to the file
                fs.writeFile('./db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.log('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'succes',
            body: newNote,
        };

        console.log(response);
        res.json(response);
    } else {
        res.json('Error in posting note');
    }
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
)