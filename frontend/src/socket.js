import { io } from "socket.io-client";
export const socket = io("http://localhost:5000");

import { io } from "socket.io-client";
const socket = io("http://localhost:5003");

socket.on("status", data => {
  console.log("Server status:", data);
});
