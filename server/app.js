const express = require('express');
const cors = require('cors');
const crawlerRoutes = require('./src/routes/routes')


const app = express();
const PORT = process.env.PORT || 5172;

app.use(cors());

app.use(express.json())
//app.set('views', path.join(__dirname, 'src', 'views'));

// Set the static folder to serve CSS, JS, and other static files
//app.use(express.static(path.join(__dirname, 'src', 'public')));

// Set server to receive data via POST - form
app.use(express.urlencoded({ extended: true }))

// Routers

app.use(crawlerRoutes)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));