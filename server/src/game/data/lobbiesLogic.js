import { serverMessages } from "../../websocketEvents.js";

let activeLobbies = [];

export async function getGames() {
  console.log("Get games active lobbies:", activeLobbies);
  return activeLobbies;
}

export async function joinGame(gameId, player) {
  const selectedGame = activeLobbies.find(
    (selectedGame) => selectedGame.gameId === gameId
  );

  if (!selectedGame) {
    throw new Error("La sala de juego no existe");
  }

  if (selectedGame.players.length >= selectedGame.num_players) {
    throw new Error("La sala de juego ya ha alcanzado el maximo de jugadores");
  }

  selectedGame.players.push(player);

  return selectedGame;
}

export async function leaveGame(gameId, player) {
  const selectedGameIndex = activeLobbies.findIndex(
    (selectedGame) => selectedGame.gameId === gameId
  );

  if (selectedGameIndex === -1) {
    throw new Error("La sala de juego ya no existe");
  }

  const selectedGame = activeLobbies[selectedGameIndex];

  if (!selectedGame.players.includes(player)) {
    throw new Error("No estas en la sala de juego");
  }

  const updatedPlayers = selectedGame.players.filter(
    (selectedPlayer) => selectedPlayer !== player
  );

  const updatedGame = {
    ...selectedGame,
    players: updatedPlayers,
  };

  try {
    const index = activeLobbies.findIndex((game) => game.gameId === gameId);
    activeLobbies[index] = updatedGame;

    if (updatedPlayers.length === 0) {
      activeLobbies.splice(selectedGameIndex, 1);
    }
  } catch (error) {
    console.log(error);
  }

  return updatedGame;
}

export function createGame(player_host, max_players) {
  if (isPlayerInAnotherGame(player_host)) {
    throw new Error("Ya estas en una sala de juego");
  }

  const game = {
    gameId: generateUniqueId(),
    game_status: "waiting",
    game_history: [],
    player_host,
    max_players,
    players: [player_host],
  };

  activeLobbies.push(game);
  console.log("Active games:", activeLobbies);
  return game;
}

export function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function isPlayerInAnotherGame(player) {
  return activeLobbies.some((game) => game.players.includes(player));
}
