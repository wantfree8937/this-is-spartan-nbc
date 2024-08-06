import { dungeonSessions } from './sessions.js';

export const createDungeonSession = (id) => {
  const session = new Dungeon(id);
  dungeonSessions.push(session);
  return session;
};

export const enterDungeonSession = (user) => {
  
};

export const leaveDungeonSession = (user) => {
  
};