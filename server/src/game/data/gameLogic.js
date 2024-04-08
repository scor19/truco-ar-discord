import db from "../../db/database.js";
import { authenticateToken } from "../../auth/auth.js";

export async function getGames() {
  const [gamesData] = await db.query("SELECT * FROM games");
  return gamesData;
}

export async function joinGame(gameId) {
  const [gameData] = await db.query("SELECT * FROM games WHERE id = ?", [
    gameId,
  ]);

  const game = gameData[0];
  if (game.num_players >= 6) {
    return null;
  }

  const [updatedGame] = await db.query(
    "UPDATE games SET num_players = num_players + 1 WHERE id = ?",
    [gameId]
  );
}

export async function leaveGame(gameId) {
  // TODO: Abandonar un juego
  const [updatedGame] = await db.query(
    "UPDATE games SET player_hostm = NULL, num_players = num_players - 1 WHERE id = ?",
    [gameId]
  );
  return updatedGame;
}

export function createGame(player_host, num_players) {
  const game = {
    id: generateUniqueId(),
    player_host,
    num_players,
    players: [player_host],
  };

  activeGames.push(game);
  console.log("Active games:", activeGames);
  return game.id;
}

export function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
