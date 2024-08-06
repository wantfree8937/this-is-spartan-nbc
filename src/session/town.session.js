import { townSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

export const addTownSession = (id) => {
  const session = new Game(id);
  townSessions.push(session);
  return session;
};

export const removeTownSession = (id) => {
  const index = townSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    return townSessions.splice(index, 1)[0];
  }
};

export const getTownSession = (id) => {
  return townSessions.find((session) => session.id === id);
};

export const getAllTownSessions = () => {
  return townSessions;
};
