const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('CONNECTED: ', socket.id);

  socket.on('joinRoom', ({ username, roomName }, cb) => {
    socket.username = username;
    socket.roomName = roomName;
    socket.join(roomName);

    const roomMates = Object.keys(
      io.sockets.adapter.rooms[roomName].sockets
    ).map(id => io.sockets.connected[id].username);

    socket.to(roomName).broadcast.emit('updateRoomMates', roomMates);
    cb(roomMates);
  });

  socket.on('disconnect', reason => {
    const room = io.sockets.adapter.rooms[socket.roomName];
    if (room) {
      const roomMates = Object.keys(
        io.sockets.adapter.rooms[socket.roomName].sockets
      ).map(id => io.sockets.connected[id].username);

      socket.to(socket.roomName).broadcast.emit('updateRoomMates', roomMates);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
