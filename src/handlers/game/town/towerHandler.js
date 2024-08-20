import {
  updateSoul, updateLevel, getRitualLevel, getCoinByPlayerId, getSoulByUUID
} from '../../../db/user/user.db.js';
import { getUserBySocket, getClassStats } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { getMonstersRedis, getUserStatsRedis } from '../../../db/game/redis.assets.js';
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
  const playerId = user.getPlayerId();
  const tower = user.getTower();    // 업데이트 대상 타워
  const cost = tower.getUpgradeCost();    // 강화 비용
  const statList = await getUserStatsRedis();
  const userClass = user.getUserClass();
  const initStat = getClassStats(userClass, statList);
  
  // 영혼 지불 & 업그레이드 적용 (스텟 변경) 후 DB 업데이트 (soul, level)
  const leftSoul = user.offeringSoul(cost);
  console.log('leftSoul:', leftSoul);
  const level = currentStatInfo.upgradeLevel();
  await updateSoul(leftSoul, uuid);
  await updateLevel(level, uuid);

  // upgradePacket 패킷 payload 준비
  const totalLevel = await getRitualLevel(playerId);
  const playerInfo = user.buildPlayerInfo();
  const nextCost = initStat.upgradeCost * level;
  tower.updateTower(totalLevel, playerInfo, nextCost, leftSoul);

  const upgradePacket = tower.makeUpgradePacket();
  const { ritualLevel, player, next, upgradeCost, soul } = upgradePacket;


  // 클라이언트 자원변경 반영(soul, coin)
  const userSoul = await getSoulByUUID(uuid);
  const userCoin = await getCoinByPlayerId(playerId);
  const playerItemResponse = createResponse('responseItem', 'S_Player_Item', { soul: userSoul, coin: userCoin });

  // 타워에 표시될 수치 & 마을에서 보이는 자원 수치 반영
  const playerUpgradeResponse = createResponse('responseTown', 'S_Player_Upgrade', { ritualLevel, player, next, upgradeCost, soul });
  socket.write(playerUpgradeResponse);
  socket.write(playerItemResponse);
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
