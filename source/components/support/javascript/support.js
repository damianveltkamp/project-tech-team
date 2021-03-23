import socketIO from 'socket.io-client';

export default function support() {
  const socket = socketIO('http://localhost:3000');

  // TODO emit event when user clicks on support button
  socket.emit('joinRoom');
}
