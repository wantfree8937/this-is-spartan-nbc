import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import Stat from '../classes/models/stat.class.js';
import { getUserStatsRedis } from '../db/game/redis.assets.js';

export const addUser = async (
  uuid, playerId, nickname, userClass,
  level, soul, coin, transform, socket,
) => {
  const statList = await getUserStatsRedis();
  const initStat = getClassStats(userClass, statList);
  const statInfo = new Stat(initStat);
  statInfo.setLevel(level);

  const user = new User(
    uuid, playerId, nickname, userClass,
    soul, coin, statInfo, transform, socket
  );
  await user.setTower(initStat);

  userSessions.push(user);
  return user;
};

export const getClassStats = (userClass, statList) => {
  for (let stat of statList) {
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
