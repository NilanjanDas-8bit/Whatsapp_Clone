const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); // <-- New
const { Server } = require("socket.io"); // <-- New

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend origin or use specific domain
    methods: ["GET", "POST"]
  }
});

// Store io globally to use in routes
app.set("io", io);

// Routes
const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

// MongoDB connection + Payload processing
const PORT = process.env.PORT || 5000;
const processPayloads = require("./utils/processPayloads");

// Connect to MongoDB first, then process payloads after success
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Process payloads after DB is connected
    processPayloads();

    // Start the server with socket.io
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// Debug: Print all messages from DB after 3 seconds
const Message = require("./models/Message");
setTimeout(async () => {
  try {
    const messages = await Message.find({});
    console.log("✅ Messages in DB:", messages);
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err.message);
  }
}, 3000);

// Handle socket events
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});
