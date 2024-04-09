import express from "express";
import {
  createGame,
  getGames,
  joinGame,
  leaveGame,
} from "../game/data/lobbiesLogic.js";

const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const gamesData = await getGames();
    res.json({ gamesData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", async (req, res) => {
  const { player_host, max_players } = req.body;
  const game = createGame(player_host, max_players);
  res.json({ game });
});

router.post("/join", async (req, res) => {
  try {
    const { gameId, player } = req.body;
    const gameData = await joinGame(gameId, player);
    res.json({ gameData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/leave", async (req, res) => {
  const { gameId, player } = req.body;
  const gameData = await leaveGame(gameId, player);
  res.json({ gameData });
});

export default router;
