const express = require('express');
const { connectToDb, getDb } = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors());

connectToDb((err) => {
  if (err) {
    console.error('Error occurred while connecting to the database:', err);
    return;
  }
  console.log('Connected successfully to the database');


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });

  socket.on('chat message', (msg) => {
      try {
      io.emit('chat message', msg); // Emitting the JSON string back to all clients
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
});


app.use('/', require('./router/routes'));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;
