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
  getUserUnlockByPlayerId,
  unlockCharacter,
  updateCoin,
  getCoinByPlayerId,
  getSoulByUUID,
} from './../../../db/user/user.db.js';
import { getMonstersRedis } from '../../../db/game/redis.assets.js';
// import { getGameAssets } from './../../../init/assets.js';

//접속 핸들러
const loginHandler = async ({ socket, payload }) => {
  const { nickname } = payload;
  let account;
  let playerId;

  const existUser = await getUserByNicknameDB(nickname);
  if (!existUser) {
    account = await registerUser(nickname);
  } else {
    account = existUser;
  }
  console.log(account);

  playerId = account.playerId;
  const unlocked = await getUserUnlockByPlayerId(playerId);
  const selectCharacterResponse = createResponse('responseTown', 'S_Select_Character', {
    isUnlocked: [
      unlocked[0].cerbe,
      unlocked[0].uni,
      unlocked[0].nix,
      unlocked[0].chad,
      unlocked[0].miho,
      unlocked[0].levi,
      unlocked[0].wyv,
      unlocked[0].drago,
      unlocked[0].kiri,
    ],
    coin: account.coin,
  });
  socket.write(selectCharacterResponse);
};

//캐릭터 해금 시, 핸들러
const unlockCharacterHandler = async ({ socket, payload }) => {
  const { nickname, class: className, coin } = payload;
  const playerNames = ['cerbe', 'uni', 'nix', 'chad', 'miho', 'levi', 'wyv', 'drago', 'kiri'];
  let account;
  let playerId;

  const existUser = await getUserByNicknameDB(nickname);
  if (!existUser) {
    account = await registerUser(nickname);
  } else {
    account = existUser;
  }
  playerId = account.playerId;

  const characterName = playerNames[className - 1000];

  unlockCharacter(playerId, characterName);
  updateCoin(playerId, coin);
};

//타운 입장 핸들러
const enterTownHandler = async ({ socket, payload }) => {
  console.log('You just activated my enterTownHandler');
  /*---------Enter--------*/
  const { nickname } = payload;
  const userClass = payload.class;

  const account = await getUserByNicknameDB(nickname);
  const playerId = account.playerId;

  const transform = new Transform();
  let user;
  let townUser;
  let level;
  let soul;
  let coin;
  let uuid;

  //캐릭터 X / 캐릭터 O
  let existCharacter = await getCharacterClassByIdsDB(playerId, userClass);

  if (!existCharacter) {
    // 계정 O 캐릭터 X
    uuid = await registerUserCharacter(playerId, userClass);
    level = 1;
    soul = 0;
  } else {
    // 계정 O 캐릭터 O
    uuid = existCharacter.uuid;
    level = existCharacter.level;
    soul = existCharacter.soul;
  }

  coin = account.coin;

  user = await addUser(uuid, playerId, nickname, userClass, level, soul, coin, transform, socket);

  townUser = await addUserTown(user);

  const player = townUser.buildPlayerInfo();
  //next 데이터 후추
  const next = {
    level: 1,
    hp: 1,
    atk: 1,
    mag: 1,
  };

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });

  const userSoul = await getSoulByUUID(uuid);
  const userCoin = await getCoinByPlayerId(playerId);

  const playerItemResponse = createResponse('responseItem', 'S_Player_Item', {
    soul: userSoul,
    coin: userCoin,
  });
  //ritualLevel 후추
  const upgradePacket = {
    ritualLevel: 1,
    player,
    next,
  };
  const playerUpgradeResponse = createResponse('responseTown', 'S_Player_Upgrade', upgradePacket);
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

export {
  enterTownHandler,
  enterDungeonHandler,
  enterNextStage,
  loginHandler,
  unlockCharacterHandler,
};
