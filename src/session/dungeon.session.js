import Dungeon from '../classes/models/battle/dungeon.class.js';
import { getGameAssets } from '../init/assets.js';
import { dungeonSessions } from './sessions.js';

export const createDungeonSession = (id, user) => {
  const gameAssets = getGameAssets();

  const dungeonInfo = getDungeonInfo(gameAssets);
  const textInfo = getTextInfo(gameAssets);
  const battleLogInfo = getBattleLogInfo(gameAssets);

  const session = new Dungeon(id, dungeonInfo, user, textInfo, battleLogInfo);
  dungeonSessions.push(session);

  return session;
};

const getDungeonInfo = (gameAssets) => {
  return gameAssets.dungeonInfo;
};

const getTextInfo = (gameAssets) => {
  return gameAssets.textInfo;
};

const getBattleLogInfo = (gameAssets) => {
  return gameAssets.battleLogInfo;
};

export const enterDungeonSession = (user) => {};

export const leaveDungeonSession = (user) => {};
