const express = require('express');
const dotenv = require('dotenv');
const userroutes = require("../backend-server/routes/userroutes");
const cookieParser = require('cookie-parser');
const postRoutes = require('../backend-server/routes/postsroutes');
const cors = require("cors");
const path = require("path")
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

// Database Connection
const connectDB = require('../backend-server/mongoose');
connectDB();

const _dirname = path.resolve()

// Initialize Express App
const app = express();
const server = http.createServer(app)
// Allow requests from specific origins
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // Change this to your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies, authentication headers)
  },
});

// Enable CORS for Express routes
app.use(
  cors({
    origin: "http://localhost:5174", // Must be your frontend URL, not "*"
    credentials: true, // Important: Allows cookies & authentication headers
  })
);

// Middleware to attach `io` to `req`
app.use((req, res, next) => {
  req.io = io;
  next();
});

let onlineUsers = new Map();

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add user when they join
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  // Handle real-time like notifications
  socket.on("sendNotification", ({ receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveNotification", message);
    }
  });
    // Remove user when they disconnect
    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          break;
        }
      }
      console.log("A user disconnected:", socket.id);
    });
  });

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
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
