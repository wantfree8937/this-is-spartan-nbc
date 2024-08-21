import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import { v4 as uuidv4 } from 'uuid';

export const getUserByNicknameDB = async (nickname) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_NICKNAME, [nickname]);

  return toCamelCase(rows[0]);
};

export const addUserDB = async (nickname, password) => {
  await pools.USER_DB.query(SQL_QUERIES.ADD_USER, [nickname, password]);
};

export const addUserCharacterDB = async (uuid, playerId, userClass) => {
  await pools.USER_DB.query(SQL_QUERIES.ADD_CHARACTER_CLASS, [uuid, playerId, userClass]);
};

export const addUserUnlockDB = async (playerId) => {
  await pools.USER_DB.query(SQL_QUERIES.ADD_CHARACTER_UNLOCK, [playerId]);
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

// 언락된 캐릭터 목록 가져오기
export const getUserUnlockByPlayerId = async (playerId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.GET_USER_UNLOCK, [playerId]);
  return rows; // 쿼리 결과 반환
};

// 캐릭터 언락
export const unlockCharacter = async (playerId, name) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_UNLOCK_CHARACTER(name), [playerId]);
};

//레벨 갱신
export const updateLevel = async (level, uuid) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_LEVEL, [level, uuid]);
};
// 코인 갱신
export const updateCoin = async (coin, playerId) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_COIN, [coin, playerId]);
};
//소울 갱신
export const updateSoul = async (soul, uuid) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_SOUL, [soul, uuid]);
};

// 소울만 가져오는 함수
export const getSoulByUUID = async (uuid) => {
  const [results] = await pools.USER_DB.query(SQL_QUERIES.GET_SOUL_BY_UUID, [uuid]);
  return results.length ? results[0].soul : null;
};

// 코인만 가져오는 함수
export const getCoinByPlayerId = async (playerId) => {
  const [results] = await pools.USER_DB.query(SQL_QUERIES.GET_COIN_BY_PLAYER_ID, [playerId]);
  return results.length ? results[0].coin : null;
};

//편의

export const registerUser = async (nickname, password) => {
  await addUserDB(nickname, password);
  const account = await getUserByNicknameDB(nickname);
  await addUserUnlockDB(account.playerId);
  return account;
};

export const registerUserCharacter = async (playerId, userClass) => {
  const uuid = uuidv4();
  await addUserCharacterDB(uuid, playerId, userClass);
  return uuid;
};

export const getRitualLevel = async (playerId) => {
  const [levelArray] = await pools.USER_DB.query(SQL_QUERIES.GET_RITUAL_LEVEL, [playerId]);
  const ritualLevel = levelArray.reduce((sum, item) => sum + item.level, 0) - levelArray.length;
  return ritualLevel;
};
