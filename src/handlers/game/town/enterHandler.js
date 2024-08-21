import Transform from '../../../classes/models/transfrom.class.js';
import {
  addUserTown,
  getAllList,
  getFilteredList,
  getTownSession,
} from '../../../session/town.session.js';
import { addUser, getUserBySocket, removeUser } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import { createDungeonSession, getNextStage } from '../../../session/dungeon.session.js';
import {
  getUserByNicknameDB,
  getCharacterClassByIdsDB,
  registerUser,
  registerUserCharacter,
  getUserUnlockByPlayerId,
  unlockCharacter,
  updateCoin,
  getCoinByPlayerId,
  getSoulByUUID,
} from './../../../db/user/user.db.js';
import { getMonstersRedis } from '../../../db/game/redis.assets.js';
// import { getGameAssets } from './../../../init/assets.js';

//접속 핸들러
const connectHandler = async ({ socket, payload }) => {
  const connectResponse = createResponse('responseTown', 'S_Connect', {});
  socket.write(connectResponse);
};

const registerHandler = async ({ socket, payload }) => {
  const { nickname, password } = payload;
  let isSuccess;
  let account;
  //1. 회원가입 패킷
  //2. 서버 existUser?
  const existUser = await getUserByNicknameDB(nickname);
  if (existUser) {
    isSuccess = false;
    console.log('이미 존재하는 계정입니다.');
  } else {
    account = registerUser(nickname, password);
    const registerResponse = createResponse('responseTown', 'S_Register', {
      success: true,
    });
    socket.write(registerResponse);
  }
};

//접속 핸들러
const loginHandler = async ({ socket, payload }) => {
  const { nickname, password } = payload;
  let account;
  let playerId;
  let isSuccess;
  let unlocked;
  let unlockedArray;

  account = await getUserByNicknameDB(nickname);
  if (!account) {
    console.log('존재하지 않는 계정입니다.');
  } else {
    if (account.password !== password) {
      console.log('비밀번호가 일치하지 않습니다.');
      isSuccess = false;
    } else {
      //계정 존재 + 비밀번호 일치
      playerId = account.playerId;
      unlocked = await getUserUnlockByPlayerId(playerId);
      isSuccess = true;
    }
  }
  unlockedArray = [
    unlocked[0].cerbe,
    unlocked[0].uni,
    unlocked[0].nix,
    unlocked[0].chad,
    unlocked[0].miho,
    unlocked[0].levi,
    unlocked[0].wyv,
    unlocked[0].drago,
    unlocked[0].kiri,
  ];
  //혹시 52번 브랜치, 1번던전, 2번던전 보스방 따로?
  playerId = account.playerId;
  const loginResponse = createResponse('responseTown', 'S_Login', {
    isUnlocked: unlockedArray,
    coin: account.coin,
    success: isSuccess,
  });
  socket.write(loginResponse);
};

//캐릭터 해금 시, 핸들러
const unlockCharacterHandler = async ({ socket, payload }) => {
  const { nickname, class: className, coin } = payload;
  const playerNames = ['cerbe', 'uni', 'nix', 'chad', 'miho', 'levi', 'wyv', 'drago', 'kiri'];
  let account;
  let playerId;
  let resultCoin = coin;

  const existUser = await getUserByNicknameDB(nickname);
  if (!existUser) {
    account = await registerUser(nickname);
  } else {
    account = existUser;
  }
  playerId = account.playerId;

  const characterName = playerNames[className - 1000];

  switch (characterName) {
    case 'cerbe':
      resultCoin;
      break;
    case 'uni':
      resultCoin;
      break;
    case 'nix':
      resultCoin;
      break;
    case 'chad':
      resultCoin -= 300;
      break;
    case 'miho':
      resultCoin -= 300;
      break;
    case 'levi':
      resultCoin -= 700;
      break;
    case 'wyv':
      resultCoin -= 700;
      break;
    case 'drago':
      resultCoin -= 1500;
      break;
    case 'kiri':
      resultCoin -= 1500;
      break;
  }

  unlockCharacter(playerId, characterName);
  updateCoin(resultCoin, playerId);

  const unlockPacket = createResponse('responseTown', 'S_Unlock_Character', {
    idx: className - 1000,
    coin: resultCoin,
  });
  socket.write(unlockPacket);
};

//타운 입장 핸들러
const enterTownHandler = async ({ socket, payload }) => {
  console.log('You just activated my enterTownHandler', payload);
  /*---------Enter--------*/
  // 데이터(상수) 선언 및 정의
  const { nickname } = payload;
  const userClass = payload.class;
  const account = await getUserByNicknameDB(nickname);
  const playerId = account.playerId;
  const coin = account.coin;

  //캐릭터 X / 캐릭터 O
  let existCharacter = await getCharacterClassByIdsDB(playerId, userClass);
  let uuid;
  let level;
  let leftSoul;

  if (!existCharacter) {
    // 계정 O 캐릭터 X
    uuid = await registerUserCharacter(playerId, userClass);
    level = 1;
    leftSoul = 0;
  } else {
    // 계정 O 캐릭터 O
    uuid = existCharacter.uuid;
    level = existCharacter.level;
    leftSoul = existCharacter.soul;
  }

  // uuid, level, soul 선언 후 정의가능
  const transform = new Transform();
  const user = await addUser(
    uuid,
    playerId,
    nickname,
    userClass,
    level,
    leftSoul,
    coin,
    transform,
    socket,
  );
  const townUser = await addUserTown(user);

  // 클라이언트에 반영할 타워정보
  const upgradePacket = user.getTower().makeUpgradePacket();
  const { ritualLevel, player, next, upgradeCost, soul } = upgradePacket; // player: user의 PlayerInfo
  const playerUpgradeResponse = createResponse('responseTown', 'S_Player_Upgrade', {
    ritualLevel,
    player,
    next,
    upgradeCost,
    soul,
  });

  // 클라이언트에 반영할 마을입장
  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });

  // 클라이언트에 반영할 자원(soul, coin)
  const userSoul = await getSoulByUUID(uuid);
  const userCoin = await getCoinByPlayerId(playerId);
  const playerItemResponse = createResponse('responseItem', 'S_Player_Item', {
    soul: userSoul,
    coin: userCoin,
  });

  // 클라이언트에 작성된 데이터 반영
  socket.write(playerUpgradeResponse);
  socket.write(playerItemResponse);
  socket.write(enterTownResponse);

  /*---------Spawn--------*/

  const X = -4.5;
  const Y = 0.8;
  const Z = 135;
  const ROT = 0;

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

const townSelectHandler = ({ socket, payload }) => {
  const townSession = getTownSession();
  townSession.addLeaveUsers(socket);
  removeUser(socket);
};

const enterDungeonHandler = async ({ socket, payload }) => {
  const { dungeonCode } = payload;
  const monsterData = await getMonstersRedis();
  const user = getUserBySocket(socket);

  const dungeonId = uuidv4(); // 던전 임시 id
  createDungeonSession(dungeonId, user, dungeonCode, monsterData); // 던전 세션 생성

  const townSession = getTownSession(); // 마을세션 로드
  townSession.addLeaveUsers(socket); // 마을에서 제거
  removeUser(socket);
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

export {
  enterTownHandler,
  enterDungeonHandler,
  enterNextStage,
  loginHandler,
  registerHandler,
  unlockCharacterHandler,
  townSelectHandler,
  connectHandler,
};
