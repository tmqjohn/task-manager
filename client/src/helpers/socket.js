//emit events
export function projectChanges(socket) {
  socket.emit("project-change");
}

export function joinProjectChat(data, socket) {
  socket.emit("join-room", data);
}

export function sendMessage(data, socket) {
  socket.emit("send-message", data);
}

// on events
export function updateProject(socket, updateProject) {
  socket.on("project-update", () => updateProject());
}

export function receiveMessage(socket, getMessage) {
  socket.on("receive-message", (data) => getMessage(data));
}
