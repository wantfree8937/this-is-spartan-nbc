import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import { loadGameAssets } from '../init/assets.js';

export const addUser = (playerId, nickname, userClass, transform, socket) => {
  const statInfo = getClassStats(userClass);
  const user = new User(playerId, nickname, userClass, statInfo, transform, socket);
  userSessions.push(user);

  return user;
};

const gameAssets = await loadGameAssets();
const getClassStats = (userClass) => {
  for (let stat of gameAssets.classStat.data) {
    if (stat.class === userClass) {
      return stat;
    }
  }
  return null; //에러 코드 추가?
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getUserByNickname = (nickname) => {
  return userSessions.find((user) => user.nickname === nickname);
};

export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};
