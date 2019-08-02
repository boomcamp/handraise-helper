const socket = io.connect('http://localhost:3001');

socket.on('updateRoomMates', roomMates => {
  renderStudents(roomMates);
})


const username = document.getElementById('username');
const joinBtn = document.getElementById('joinBtn');
const leaveBtn = document.getElementById('leaveBtn');
const studentList = document.getElementById('studentList');

username.addEventListener('keyup', e => {
  if (e.target.value) {
    joinBtn.disabled = false;
  } else {
    joinBtn.disabled = true;
  }
});

joinBtn.addEventListener('click', e => {
  e.target.style.display = 'none';
  username.style.display = 'none';
  leaveBtn.style.display = '';

  document.getElementById('roomTitle').innerText += `: ${username.value}`;
  socket.emit('joinRoom', { username: username.value, roomName: ROOM }, (roomMates) => {
     console.log('JOINED AND RECEIVED ROOM MATES: ', roomMates);
     renderStudents(roomMates);
  })
});

leaveBtn.addEventListener('click', () => {
  location = 'http://localhost:3001';
});

function renderStudents(names) {
  const items = names.map(name => `<li>${name}</li>`).join('');
  studentList.innerHTML = items;
}
