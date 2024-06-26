import { serverMessages } from "../../websocketEvents.js";

let activeLobbies = [];
let playersHosting = {}; // Objeto para rastrear las salas de los jugadores

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

  if (selectedGame.players.length >= selectedGame.max_players) {
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

  if (isPlayerHosting(player)) {
    delete playersHosting[player];
  }

  return updatedGame;
}

export function createGame(player_host, max_players) {
  if (isPlayerHosting(player_host)) {
    throw new Error("Ya eres anfitrion de una partida.");
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
  playersHosting[player_host] = game.gameId;

  console.log("Active games:", activeLobbies);
  return game;
}

export function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function isPlayerHosting(player) {
  return playersHosting[player] !== undefined;
}
