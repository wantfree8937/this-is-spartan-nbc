import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import { v4 as uuidv4 } from 'uuid';

export const getUserByNicknameDB = async (nickname) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_NICKNAME, [nickname]);

  return toCamelCase(rows[0]);
};

export const addUserDB = async (nickname) => {
  await pools.USER_DB.query(SQL_QUERIES.ADD_USER, [nickname]);
};

export const addUserCharacterDB = async (uuid, playerId, userClass) => {
  await pools.USER_DB.query(SQL_QUERIES.ADD_CHARACTER_CLASS, [uuid, playerId, userClass]);
};
export const getCharacterClassByIdsDB = async (playerId, userClass) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.GET_CHARACTER_CLASS_BY_IDS, [
    playerId,
    userClass,
  ]);

  if (rows.length > 0) {
    return rows[0]; // 일치하는 레코드가 있으면 첫 번째 레코드를 반환
  } else {
    return null; // 일치하는 레코드가 없으면 null 반환
  }
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

//편의

export const registerUser = async (nickname, userClass) => {
  const uuid = uuidv4();
  await addUserDB(nickname);
  const account = await getUserByNicknameDB(nickname);
  await addUserCharacterDB(uuid, account.playerId, userClass);
  return account;
};

export const registerUserCharacter = async (playerId, userClass) => {
  const uuid = uuidv4();
  await addUserCharacterDB(uuid, playerId, userClass);
};
