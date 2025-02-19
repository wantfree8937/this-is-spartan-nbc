import { townSessions } from './sessions.js';
import Town from './../classes/models/Town.class.js';

export const initializeTownSession = () => {
  addTownSession();
};

export const addTownSession = () => {
  const session = new Town();
  townSessions.push(session);
  return session;
};

export const getTownSession = () => {
  return townSessions[0];
};

export const removeTownSession = () => {
  return townSessions.splice(0, 1)[0];
};

export const addUserTown = (user) => {
  const townSession = townSessions[0];
  //게임세션의 타운 세션은 어디에 사용하는 것인가?
  townSession.users.push(user);
  return user;
};

export const getTownUserByPlayerId = (playerId) => {
  return townSessions.find((user) => user.playerId === playerId);
};

export const getTownUserByNickname = (Nickname) => {
  return townSessions[0].users.find((user) => user.nickname === Nickname);
};

export const getTownUserBySocket = (socket) => {
  return townSessions[0].users.find((user) => user.socket === socket);
};

export const getAllTownSocket = () => {
  // const userData = townSessions[0].users.find((socketdata) => socketdata);
  const socketList = [];
  townSessions[0].users.forEach((element) => socketList.push(element.socket));
  return socketList;
};

//현재 작업 중
export const getFilteredList = (playerId) => {
  const filteredUserList = townSessions[0].users.filter((user) => user.playerId !== playerId);
  return filteredUserList;
};

export const getAllList = () => {
  return townSessions[0].getUsers();
};
