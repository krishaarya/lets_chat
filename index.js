import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Server } from "socket.io";

const app = express();
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
const io = new Server(server);

function getCurrentDateTime() {
  const currentDate = new Date();

  // Get date components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Get time components
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  // Format the date and time
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

// Usage

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

// Socket.io connection
io.on("connection", (socket) => {
  const dateTimeString = getCurrentDateTime();
  console.log("A user connected");
  io.emit("chat message", `A user connected at: ${dateTimeString}`);

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg); // Broadcast the message to all connected clients
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    const dateTimeString = getCurrentDateTime();
    console.log("User disconnected");
    io.emit("chat message", `A user disconnected at: ${dateTimeString}`);
  });
});
