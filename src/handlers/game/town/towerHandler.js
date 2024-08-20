import { updateSoul, updateLevel } from '../../../db/user/user.db.js';
import { getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { getMonstersRedis } from '../../../db/game/redis.assets.js';
import { createDungeonSession, getNextStage } from '../../../session/dungeon.session.js';
import { getTownSession } from './../../../session/town.session.js';
import { enterNextStage } from './enterHandler.js';
import { v4 as uuidv4 } from 'uuid';

export const characterUpgradeHandler = async ({ socket, payload }) => {
  console.log('TestCode #47::', payload);

  // 업그레이드 전 데이터 준비
  const user = getUserBySocket(socket);
  const currentStatInfo = user.getStatInfo();
  const uuid = user.getUUID();
  const cost = user.getTower().getUpgradeCost();

  // 영혼 지불 & 업그레이드 적용 (스텟 변경) 후 DB 업데이트 (soul, level)
  user.offeringSoul(cost);
  const leftSoul = user.getSoul();
  const level = currentStatInfo.upgradeLevel();
  await updateSoul(leftSoul, uuid);
  await updateLevel(level, uuid);

  // upgradePacket 패킷 payload 준비
  const tower = user.getTower();
  const nextInfo = tower.getNextInfo();
  nextInfo.updateNextInfo();
  const upgradePacket = tower.makeUpgradePacket();
  const { ritualLevel, player, next, upgradeCost, soul } = upgradePacket;

  // 타워에 표시될 수치 반영
  const playerUpgradeResponse = createResponse('responseTown', 'S_Player_Upgrade', {
    ritualLevel,
    player,
    next,
    upgradeCost,
    soul,
  });
  socket.write(playerUpgradeResponse);
};

export const finalBossHandler = async ({ socket, payload }) => {
  const { dungeonCode } = payload;
  const monsterData = await getMonstersRedis();
  const user = getUserBySocket(socket);

  const dungeonId = uuidv4(); // 던전 임시 id
  createDungeonSession(dungeonId, user, dungeonCode, monsterData); // 던전 세션 생성

  const townSession = getTownSession(); // 마을세션 로드
  townSession.addLeaveUsers(socket); // 마을에서 제거

  // 참가된 던전의 스테이지 추출
  const stage = getNextStage(socket);
  // 스테이지 진입
  enterNextStage(socket, stage);
};
