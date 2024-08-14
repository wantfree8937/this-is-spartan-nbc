import Dungeon from '../classes/models/battle/dungeon.class.js';
// import { getGameAssets } from '../init/assets.js';
import { dungeonSessions } from './sessions.js';

export const createDungeonSession = (id, user, dungeonCode) => {

  const session = new Dungeon(id, user, dungeonCode);    // 던전 세션 생성
  session.initDungeon();
  dungeonSessions.push(session);    // 던전 세션 등록

  return session;   // 생성된 세션 반환
};

export const getDungeonById = (id) => {
  return dungeonSessions.find((session) => session.id === id);
};

export const getNextStage = (dungeonId) => {
  const targetId = dungeonId;
  
  let stage;
  console.log('dungeonSessions:', dungeonSessions);
  const target = getDungeonById(targetId);
  console.log('found target:', target);
  
  stage = target.getNextStage();

  return stage;
}

export const enterDungeonSession = (user) => {};
export const leaveDungeonSession = (user) => {};
