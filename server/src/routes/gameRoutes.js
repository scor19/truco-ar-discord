import express from "express";
import { createGame, joinGame } from "../game/data/gameLogic.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gameData = await getGame();
    res.json({ gameData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", async (req, res) => {
  const { player_host, num_players } = req.body;
  const gameId = createGame(player_host, num_players);
  res.json({ gameId });
});

router.post("/join", async (req, res) => {
  try {
    const gameData = await joinGame(req.body.gameId);
    res.json({ gameData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
