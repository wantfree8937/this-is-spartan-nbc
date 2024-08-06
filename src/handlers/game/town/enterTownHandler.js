import Stat from '../../../classes/models/stat.class.js';
import { addUserDB, findUserByNickname } from '../../../db/user/user.db.js';
import { loadGameAssets } from '../../../init/assets.js';
import { userSessions } from '../../../session/sessions.js';
import { addUser } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

const gameAssets = await loadGameAssets();

const getClassStats = (classId) => {
  for (let stat of gameAssets.classStat.data) {
    if (stat.class === classId) {
      return stat;
    }
  }
  return null; //에러 코드 추가?
};
const enterTownHandler = async ({ socket, payload }) => {
  const { nickname } = payload;
  const userClass = payload.class;

  //현재 상태는 로그인 할때마다 초기화..nickename으로 playerData 탐색 먼저..DB 레츠고
  //TownSession, userSession 계속 접근할 플레이어 데이터 추가 레츠고
  //참조 데이터는 우선 nickname(userId)으로? userData탐색
  //궁금한점, socket을 이용한 탐색..

  const existUser = await findUserByNickname(nickname);
  if (!existUser) {
    addUserDB(nickname, userClass, 1);
  }

  const playerId = uuidv4();

  const classStats = getClassStats(userClass);
  const stat = new Stat(classStats);

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
    transform: transformInfo,
    statInfo: statInfo,
  };

  addUser(playerId, nickname, userClass, stat, socket);
  console.log(`userSessions :`, userSessions);

  // console.log(`player :`, player);
  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });

  socket.write(enterTownResponse);
};

export default enterTownHandler;
