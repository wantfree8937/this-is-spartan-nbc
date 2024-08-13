import Dungeon from '../classes/models/battle/dungeon.class.js';
import { getGameAssets } from '../init/assets.js';
import { dungeonSessions } from './sessions.js';

export const createDungeonSession = (id, user) => {
  const gameAssets = getGameAssets();

  const dungeonInfo = getDungeonInfo(gameAssets).stage_1;
  const textInfo = getTextInfo(gameAssets).stage_1;
  const dungeonEnterLog = getBattleLogInfo(gameAssets).stage_1;

  const session = new Dungeon(id, dungeonInfo, user, textInfo, dungeonEnterLog);
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
  return gameAssets.dungeonEnterLog;
};

export const nextDungeonSession = (socket, user) => {
  const gameAssets = getGameAssets();

  const dungeonInfo = getDungeonInfo(gameAssets).stage_2;
  const textInfo = getTextInfo(gameAssets).stage_2;
  const dungeonEnterLog = getBattleLogInfo(gameAssets).stage_2;

  const dungeonSession = getDungeonSession(socket);
  dungeonSession.nextStageInfo(dungeonInfo, user, textInfo, dungeonEnterLog);

  return dungeonSession;
};

export const getDungeonSession = (socket) => {
  return dungeonSessions.find((session) => session.users.some((user) => user.socket === socket));
};

export const enterDungeonSession = (user) => {};

export const leaveDungeonSession = (user) => {};
