import express from "express";
import dotenv from "dotenv";
import {
  getGames,
  joinGame,
  leaveGame,
  createGame,
} from "./game/data/lobbiesLogic.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { clientMessages, serverMessages } from "./websocketEvents.js";

dotenv.config({ path: "../.env" });

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3001;

// Websocket
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on(clientMessages.GET_GAMES, async () => {
    try {
      const gamesData = await getGames();
      socket.emit(serverMessages.GAMES_DATA, gamesData);
    } catch (error) {
      console.error("Error al manejar mensaje del cliente:", error);
      // Enviar un mensaje de error al cliente si es necesario
    }
  });

  socket.on(clientMessages.CREATE_GAME, async (data) => {
    try {
      const game = createGame(data.player_host, data.max_players);
      socket.emit(serverMessages.GAME_CREATED, game);
    } catch (error) {
      console.error("Error al manejar mensaje del cliente:", error);
      // Enviar un mensaje de error al cliente si es necesario
      socket.emit(serverMessages.GAME_ERROR, error.message);
    }
  });

  socket.on(clientMessages.JOIN_GAME, async (data) => {
    try {
      const joinedGame = await joinGame(data.gameId, data.player);
      socket.emit(serverMessages.GAME_JOINED, joinedGame);
    } catch (error) {
      console.error("Error al manejar mensaje del cliente:", error);
      // Enviar un mensaje de error al cliente si es necesario
    }
  });

  socket.on(clientMessages.LEAVE_GAME, async (data) => {
    try {
      const leftGame = await leaveGame(data.gameId, data.player);
      socket.emit(serverMessages.GAME_LEFT, leftGame);
    } catch (error) {
      console.error("Error al manejar mensaje del cliente:", error);
      // Enviar un mensaje de error al cliente si es necesario
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Allow express to parse JSON bodies
app.use(express.json());

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
