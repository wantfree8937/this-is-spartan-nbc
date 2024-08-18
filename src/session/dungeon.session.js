import Dungeon from '../classes/models/battle/dungeon.class.js';
// import { getGameAssets } from '../init/assets.js';
import { dungeonSessions } from './sessions.js';

export const createDungeonSession = (id, user, dungeonCode) => {

  const session = new Dungeon(id, user, dungeonCode);    // 던전 세션 생성
  session.initDungeon();
  session.initStage();
  dungeonSessions.push(session);    // 던전 세션 등록

  return session;   // 생성된 세션 반환
};

export const getDungeonById = (id) => {
  return dungeonSessions.find((session) => session.id === id);
};
export const getDungeonBySocket = (socket) => {
  return dungeonSessions.find((session) => session.user.socket === socket);
};

export const getNextStage = (socket) => {
  const targetSocket = socket;
  const targetDungeon = getDungeonBySocket(targetSocket);
  
  const stage = targetDungeon.getStageNow();
  return stage;
};

// 세션 종료(제거)
export const endSesssionById = (targetId) => { 
  const targetIdx = dungeonSessions.findIndex((dungeon) => dungeon.id = targetId);
  dungeonSessions.splice(targetIdx, 1);
}

export const enterDungeonSession = (user) => {};
export const leaveDungeonSession = (user) => {};
