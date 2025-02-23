const express = require('express');
const dotenv = require('dotenv');
const userroutes = require("../backend-server/routes/userroutes");
const cookieParser = require('cookie-parser');
const postRoutes = require('../backend-server/routes/postsroutes');
const cors = require("cors");
const path = require("path")

// Load environment variables
dotenv.config();

// Database Connection
const connectDB = require('../backend-server/mongoose');
connectDB();

const _dirname = path.resolve()

// Initialize Express App
const app = express();
// Allow requests from specific origins
app.use(
    cors({
      origin: "https://instagramclone-sxrf.onrender.com",
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      credentials: true, // Allow cookies if needed
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies


// User Routes
app.use('/api/users', userroutes);

// Routes
app.use('/api/posts', postRoutes);



app.use(express.static(path.join(_dirname,"/frontend/my-react-app/dist")));
app.get("*",(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend/my-react-app","dist","index.html"))
})
// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
