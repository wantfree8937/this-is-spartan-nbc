import NextInfo from '../../../classes/models/nextInfo.class.js';
import { getRitualLevel, updateLevel } from '../../../db/user/user.db.js';
import { getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export const characterUpgradeHandler = async ({ socket, payload }) => {
  console.log('TestCode #47::', payload);

  const user = getUserBySocket(socket);
  const currentStatInfo = user.getStatInfo();
  const uuid = user.getUUID();
  const level = currentStatInfo.upgradeLevel();
  //스탯도 여기서 올려야함 level
  await updateLevel(level, uuid);
  //upgrade 발생! user에 레벨에 맞는 스탯 부여
  let nextLevel = currentStatInfo.getLevel() + 1;
  let nextHp = currentStatInfo.getHp() + 200 * nextLevel;
  let nextAttack = currentStatInfo.getAttack() + 50 * nextLevel;
  let nextMagic = currentStatInfo.getMagic() + 70 * nextLevel;

  const playerId = user.getPlayerId();

  const soul = user.getSoul();
  const ritualLevel = await getRitualLevel(playerId);
  const player = user.buildPlayerInfo(); //next 레벨 데이터 후추

  const next = new NextInfo(nextLevel, nextHp, nextAttack, nextMagic);

  const upgradePacket = {
    ritualLevel: ritualLevel, //<==이건 통합
    player,
    next,
    upgradeCost: 100,
    soul: soul, //남은 영혼
  };
  const playerUpgradeResponse = createResponse('responseTown', 'S_Player_Upgrade', upgradePacket);
  socket.write(playerUpgradeResponse);
};


const finalBossHandler = async ({socket, payload}) => {
  
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
}