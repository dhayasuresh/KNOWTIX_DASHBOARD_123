export default function initSockets(io) {
  let groups = [];
  let polls = [];

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);
    socket.emit("groups", groups);
    socket.emit("polls", polls);

    socket.on("createGroup", (group) => {
      if (group?.id && group?.name) {
        groups.push(group);
        io.emit("groups", groups);
      }
    });

    socket.on("joinGroup", (groupId) => socket.join(groupId));
    socket.on("sendMessage", (msg) => io.to(msg.group).emit("message", msg));

    socket.on("createPoll", (poll) => {
      if (poll?.id && poll?.group) {
        polls.push(poll);
        io.to(poll.group).emit("polls", polls.filter((p) => p.group === poll.group));
      }
    });

    socket.on("votePoll", ({ id, group }) => {
      const poll = polls.find((p) => p.id === id);
      if (poll) {
        poll.votes = (poll.votes || 0) + 1;
        io.to(group).emit("polls", polls.filter((p) => p.group === group));
      }
    });

    socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
  });
}
