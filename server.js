const express = require('express');
const notesRoutes = require('./routes/notesRoutes');

// Initialize the app and create a PORT
const app = express();
const PORT =  process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use apiRoutes
app.use('/api', notesRoutes);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
)