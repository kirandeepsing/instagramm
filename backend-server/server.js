const express = require('express');
const dotenv = require('dotenv');
const userroutes = require("../backend-server/routes/userroutes");
const cookieParser = require('cookie-parser');
const postRoutes = require('../backend-server/routes/postsroutes');
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Database Connection
const connectDB = require('../backend-server/mongoose');
connectDB();

const __dirname = path.resolve();

// Initialize Express App
const app = express();

// Enable CORS for Express routes
app.use(
  cors({
    origin: "https://instagramm-1gmf.onrender.com", // Must be your frontend URL, not "*"
    credentials: true, // Important: Allows cookies & authentication headers
  })
);

app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// User Routes
app.use('/api/users', userroutes);

// Routes
app.use('/api/posts', postRoutes);

app.use(express.static(path.join(__dirname, "/frontend/my-react-app/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/my-react-app", "dist", "index.html"));
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
