import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (playerId, nickname, userClass, statInfo, transformInfo, socket) => {
  console.log('In_addUser_socket:', socket);
  const user = new User(playerId, nickname, userClass, statInfo, transformInfo, socket);
  userSessions.push(user);
  console.log('user.socket:', user.socket);
  return user;
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
