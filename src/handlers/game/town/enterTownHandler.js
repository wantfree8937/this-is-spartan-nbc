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

  const existUser = await findUserByNickname(nickname);
  if (!existUser) {
    addUserDB(nickname, userClass, 1);
  }

  const playerId = uuidv4();

  const classStats = getClassStats(userClass);

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

  //유저를 유저 세션에 더하며 타운세션에도 추가...?그럼 게임 세션에 있는 타운 세션에는? 통합해야함;
  const user = addUser(playerId, nickname, userClass, socket);
  addUserTown(user);

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });

  socket.write(enterTownResponse);
  //플레이어를 타운 세션에서 가져와야함.

  const players = []; //??player 배열? TownSession.users에 들어가는 유저들, 본인 빼고
  const filteredUserList = getFilteredList(playerId);
  console.log('필터된 정보', filteredUserList);

  //1. foreach 작성 로직은 완성
  filteredUserList.forEach((user) => {
    const { playerId, nickname, class: userClass, transform, statInfo } = user;
    players.push({ playerId, nickname, class: userClass, transform, statInfo });
  });

  const spawnUserResponse = createResponse('responseTown', 'S_Spawn', { players });
  socket.write(spawnUserResponse);
};

export default enterTownHandler;
