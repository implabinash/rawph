import express from "express";
import { Server } from "socket.io";

import { createServer } from "node:http";

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
	console.log(`${socket.id} connected.`);
});

server.listen(PORT, () => {
	console.log(`server running at http://localhost:${PORT}`);
});
