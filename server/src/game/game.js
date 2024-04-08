import { deck } from "./constants/cards.js";

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCards(numCards, players) {
  shuffle(deck);

  const hands = {};

  for (let i = 0; i < players.length; i++) {
    hands[players[i]] = [];

    for (let j = 0; j < numCards; j++) {
      hands[players[i]].push(deck.pop());
    }
  }

  return hands;
}

export { dealCards };