import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Change to your backend URL

export default socket;
