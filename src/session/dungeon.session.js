import { dungeonSessions } from './sessions.js';

export const createDungeonSession = (id) => {
  const session = new Dungeon(id);
  dungeonSessions.push(session);
  return session;
};

export const enterDungeonSession = (user) => {
  const USER = user;
  dungeonSessions.push(USER);
  return session;
};

export const leaveDungeonSession = (user) => {
  const USER = user;
  dungeonSessions.push(USER);
  return session;
};