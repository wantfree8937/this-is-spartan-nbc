import Transform from '../../../classes/models/transfrom.class.js';
import {
  addUserTown,
  getAllList,
  getFilteredList,
  getTownSession,
} from '../../../session/town.session.js';
import { addUser, getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import { createDungeonSession, getNextStage } from '../../../session/dungeon.session.js';
import {
  getUserByNicknameDB,
  getCharacterClassByIdsDB,
  registerUser,
  registerUserCharacter,
} from './../../../db/user/user.db.js';
import { getMonstersRedis } from '../../../db/game/redis.assets.js';
// import { getGameAssets } from './../../../init/assets.js';
const loginHandler = async ({ socket, payload }) => {};
const enterTownHandler = async ({ socket, payload }) => {
  /*---------Enter--------*/
  const { nickname } = payload;
  const userClass = payload.class;

  let transform;
  let user;
  let townUser;
  let playerId;
  let account;
  //정의할것.
  let level;
  let soul;

  //경우의 수
  //1. 계정X
  //2. 계정O 캐릭터 X
  //3. 계정O 캐릭터 O
  const existUser = await getUserByNicknameDB(nickname, userClass);
  if (!existUser) {
    //1. 계정 X
    account = await registerUser(nickname, userClass);
    playerId = account.playerId;
    transform = new Transform();
    level = 1;
    soul = 0;

    user = await addUser(playerId, nickname, userClass, level, soul, transform, socket);
  } else {
    account = existUser;
    playerId = existUser.playerId;

    let existCharacter = await getCharacterClassByIdsDB(playerId, userClass);
    console.log('existUserCharacter::', existCharacter);
    if (!existCharacter) {
      //2. 계정 O 캐릭터 X
      registerUserCharacter(playerId, userClass);
      level = 1;
      soul = 0;

      transform = new Transform(); //lastX lastY 저장? lastX와 lastY 게임 종료 or 던전 입장때 저장

      user = await addUser(playerId, nickname, userClass, level, soul, transform, socket);
    } else {
      level = existCharacter.level;
      soul = existCharacter.soul;
      transform = new Transform();

      user = await addUser(playerId, nickname, userClass, level, soul, transform, socket);
    }
  }

  console.log('uesr::::::::::::::', user);
  townUser = await addUserTown(user);

  const player = townUser.buildPlayerInfo();

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });

  //packet 테스트 코드
  const playerItemResponse = createResponse('responseItem', 'S_Player_Item', {
    soul: 10000,
    coin: 10000,
  });
  socket.write(playerItemResponse);
  const isUnlocked = [1, 1, 1, 0, 0, 0, 0, 0, 0];
  const selectCharacterResponse = createResponse('responseTown', 'S_Select_Character', {
    isUnlocked: isUnlocked,
    coin: 0,
  });
  socket.write(selectCharacterResponse);
  //여기까지 packet 테스트 코드

  socket.write(enterTownResponse);

  /*---------Spawn--------*/

  const X = -4.5;
  const Y = 0.8;
  const Z = 135;
  const ROT = 0;

  console.log('user::::::::::', townUser);
  user.updatePosition(X, Y, Z, ROT);
  //towerSession에서 가져온 유저
  const allList = getAllList();
  allList.forEach((user) => {
    //user에서 소켓을 뽑아내서, 그 socket.write를 실행
    const userSocket = user.getSocket();
    const playerId = user.getPlayerId();
    const filteredList = getFilteredList(playerId);
    const players = [];
    filteredList.forEach((user) => {
      const playerInfo = user.buildPlayerInfo();
      players.push(playerInfo);
    });

    const spawnUserResponse = createResponse('responseTown', 'S_Spawn', { players });
    //받아온 정보를 반복문으로 transform으로 생성하는 위치만
    userSocket.write(spawnUserResponse);
  });
};

const enterDungeonHandler = async ({ socket, payload }) => {
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

const enterNextStage = (socket, nextStage) => {
  const { dungeonInfo, player, screenText, battleLog } = nextStage;

  if (nextStage == -1) {
    // 던전 종료(클리어)시 던전나가기
    const leaveDungeonResponse = createResponse('responseTown', 'S_Leave_Dungeon', {});
    socket.write(leaveDungeonResponse);
  } else {
    // 클라이언트에 생성할 스테이지 정보전달
    const enterDungeonResponse = createResponse('responseTown', 'S_Enter_Dungeon', {
      dungeonInfo,
      player,
      screenText,
      battleLog,
    });
    socket.write(enterDungeonResponse);
  }
};

export { enterTownHandler, enterDungeonHandler, enterNextStage, loginHandler };
