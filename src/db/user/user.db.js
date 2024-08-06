import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByNickname = async (nickname) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_NICKNAME, [nickname]);
  console.log(`11111111111111111111111111111111111111111`);
  return toCamelCase(rows[0]);
};

export const addUserDB = async (nickname, userClass, userLevel) => {
  await pools.USER_DB.query(SQL_QUERIES.ADD_USER, [nickname, userClass, userLevel]);
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};
