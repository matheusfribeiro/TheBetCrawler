const express = require('express');
const path = require('path')

const app = express();
const PORT = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'src', 'views'));

// Set the static folder to serve CSS, JS, and other static files
app.use(express.static(path.join(__dirname, 'src', 'frontend', 'public')));

// Set server to receive data via POST - form
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));