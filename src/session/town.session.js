import { townSessions, userSessions } from './sessions.js';
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

// export const removeUser = (socket) => {
//   const index = userSessions.findIndex((user) => user.socket === socket);
//   if (index !== -1) {
//     return userSessions.splice(index, 1)[0];
//   }
// };

// export const getUserById = (id) => {
//   return userSessions.find((user) => user.id === id);
// };

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

//현재 작업 중
export const getFilteredList = (playerId) => {
  const filteredUserList = townSessions[0].users.filter((user) => user.playerId !== playerId);
  return filteredUserList;
};

//??
// export const getNextSequence = (id) => {
//   const user = getUserById(id);
//   if (user) {
//     return user.getNextSequence();
//   }
//   return null;
// };
