import { loadGameAssets } from '../../../init/assets.js';
import { getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

const gameAssets = await loadGameAssets();

const getClassStats = (classId) => {
  for (let stat of gameAssets.classStat.data) {
    if (stat.class === classId) {
      return stat;
    }
  }
  return null; //에러?
};
const enterTownHandler = async ({ socket, payload }) => {
  const { nickname } = payload;
  const classId = payload.class;

  const playerId = uuidv4(); //<= 요걸 어디 저장해놓고 특정할 수 있어야할텐데..userSession? userClass?

  //classCategory에 맞는 클래스 데이터를 class.json에서 불러오기
  const classStats = getClassStats(classId);

  const statInfo = {
    level: 1,
    hp: classStats.maxHp,
    maxHp: classStats.maxHp,
    mp: classStats.maxMp,
    maxMp: classStats.maxMp,
    atk: classStats.atk,
    def: classStats.def,
    magic: classStats.magic,
    speed: classStats.speed,
  };

  const transformInfo = {
    posX: 0,
    posY: 1,
    posZ: 0,
    rot: 0,
  };

  const player = {
    playerId: playerId,
    nickname: nickname,
    class: classStats.class,
    transformInfo: transformInfo,
    statInfo: statInfo,
  };

  console.log(player);
  const enterTownResponse = createResponse('responseTown', 'S_Enter', player);

  socket.write(enterTownResponse);
};

export default enterTownHandler;
