const express = require('express');
const path = require('path')
const cors = require('cors');

// Allow requests from any origin (you can restrict this to specific origins if needed)

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());

app.use(express.json())
//app.set('views', path.join(__dirname, 'src', 'views'));

// Set the static folder to serve CSS, JS, and other static files
//app.use(express.static(path.join(__dirname, 'src', 'public')));

// Set server to receive data via POST - form
//app.use(express.urlencoded({ extended: true }))

app.get("/api", (req, res, next) => {
  try {
    // Your data retrieval logic here
    const data = ["userOne", "userTwo", "userThree"];
    res.setHeader("Content-Type", "application/json"); // Set the Content-Type header
    res.json({ users: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));