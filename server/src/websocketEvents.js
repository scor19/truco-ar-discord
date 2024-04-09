// Mensajes enviados desde el cliente al servidor
export const clientMessages = {
  GET_GAMES: "get_games",
  CREATE_GAME: "create_game",
  JOIN_GAME: "join_game",
  LEAVE_GAME: "leave_game",
};

// Mensajes enviados desde el servidor al cliente
export const serverMessages = {
  GAMES_DATA: "games_data",
  GAME_CREATED: "game_created",
  GAME_JOINED: "game_joined",
  GAME_LEFT: "game_left",
  GAME_ERROR: "game_error",
};
