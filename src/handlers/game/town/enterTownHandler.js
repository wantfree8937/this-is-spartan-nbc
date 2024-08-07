import Stat from '../../../classes/models/stat.class.js';
import Transform from '../../../classes/models/transfrom.class.js';
import { addUserDB, findUserByNickname } from '../../../db/user/user.db.js';
import { loadGameAssets } from '../../../init/assets.js';
import { addUserTown, getFilteredList } from '../../../session/town.session.js';
import { addUser } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

const gameAssets = await loadGameAssets();

const getClassStats = (userClass) => {
  for (let stat of gameAssets.classStat.data) {
    if (stat.class === userClass) {
      return stat;
    }
  }
  return null; //에러 코드 추가?
};

const enterTownHandler = async ({ socket, payload }) => {
  const { nickname } = payload;
  const userClass = payload.class;

  // const existUser = await findUserByNickname(nickname);
  // if (!existUser) {
  // addUserDB(nickname, userClass, 1);
  // }

  const playerId = uuidv4();

  const classStats = getClassStats(userClass);
  const transform = new Transform();

  //level = 1 : 초기 데이터 (우찬님이 바로 쓸 수 있는 배열 만들어 주신다고 함)
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

  const player = {
    playerId: playerId,
    nickname: nickname,
    class: classStats.class,
    transform: transform,
    statInfo: statInfo,
  };

  const user = addUser(playerId, nickname, userClass, transform, socket);
  addUserTown(user);

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });
  socket.write(enterTownResponse);
  //플레이어를 타운 세션에서 가져와야함.

  const players = []; //??player 배열? TownSession.users에 들어가는 유저들, 본인 빼고
  const filteredUserList = getFilteredList(playerId);

  filteredUserList.forEach((user) => {
    const { playerId, nickname, transformInfo, statInfo } = user;
    const userClass = user.userClass;
    players.push({ playerId, nickname, class: userClass, transform: transformInfo, statInfo });
  });

  const spawnUserResponse = createResponse('responseTown', 'S_Spawn', { players });

  socket.write(spawnUserResponse);
};

export default enterTownHandler;
