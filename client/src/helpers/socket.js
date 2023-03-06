export function joinProjectChat(data, socket) {
  socket.emit("join-room", data);
}

export function sendMessage(data, socket) {
  socket.emit("send-message", data);
}

export function receiveMessage(socket, getMessage) {
  socket.on("receive-message", (data) => getMessage(data.message));
}
