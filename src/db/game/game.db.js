import { GAME_QUERIES } from './game.queries.js';
import pools from '../database.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const getUserStats = async () => {
  const [rows] = await pools.GAME_DB.query(GAME_QUERIES.FIND_ALL_USER_STATS);
  const camelCasedRows = rows.map(toCamelCase);
  const jsonString = JSON.stringify(camelCasedRows);
  return jsonString;
};

export const getMonsterStats = async () => {
  const [rows] = await pools.GAME_DB.query(GAME_QUERIES.FIND_ALL_MONSTER_STATS);
  const camelCasedRows = rows.map(toCamelCase);
  const jsonString = JSON.stringify(camelCasedRows);
  return jsonString;
};

export const getMapCodes = async () => {
  const [rows] = await pools.GAME_DB.query(GAME_QUERIES.FIND_ALL_MAP_CODES);
  const camelCasedRows = rows.map(toCamelCase);
  const jsonString = JSON.stringify(camelCasedRows);
  return jsonString;
};

export const getTextInfo = async () => {
  const [rows] = await pools.GAME_DB.query(GAME_QUERIES.FIND_ALL_TEXT_INFO);
  const camelCasedRows = rows.map(toCamelCase);
  const jsonString = JSON.stringify(camelCasedRows);
  return jsonString;
};
