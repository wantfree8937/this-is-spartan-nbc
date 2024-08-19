import Transform from '../../../classes/models/transfrom.class.js';
import { addUserTown, getAllList, getFilteredList, getTownSession, } from '../../../session/town.session.js';
import { addUser, getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import { createDungeonSession, getNextStage } from '../../../session/dungeon.session.js';
import { addUserDB, getUserByNicknameDB } from './../../../db/user/user.db.js';
// import { getGameAssets } from './../../../init/assets.js';

const enterTownHandler = async ({ socket, payload }) => {
  /*---------Enter--------*/
  const { nickname } = payload;
  const userClass = payload.class;
  let transform;
  let user;
  let townUser;
  let playerId;
  let account;
  //닉네임으로 유저가 있는 지 확인
  const existUser = await getUserByNicknameDB(nickname);
  console.log(existUser);
  if (!existUser) {
    await addUserDB(nickname, userClass, 1);
    account = await getUserByNicknameDB(nickname);

    playerId = account.playerId;
    transform = new Transform();

    user = addUser(playerId, nickname, userClass, transform, socket);
  } else {
    account = await getUserByNicknameDB(nickname);

    playerId = account.playerId;
    transform = new Transform(); //lastX lastY 저장? lastX와 lastY 게임 종료 or 던전 입장때 저장

    user = addUser(playerId, nickname, userClass, transform, socket);
  }

  townUser = addUserTown(user);

  const player = townUser.buildPlayerInfo();

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });
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

const enterDungeonHandler = ({ socket, payload }) => {
  const { dungeonCode } = payload;
  const user = getUserBySocket(socket);

  const dungeonId = uuidv4();   // 던전 임시 id
  createDungeonSession(dungeonId, user, dungeonCode);     // 던전 세션 생성

  const townSession = getTownSession();   // 마을세션 로드
  townSession.addLeaveUsers(socket);      // 마을에서 제거

  // 참가된 던전의 스테이지 추출
  const stage = getNextStage(socket);
  // 스테이지 진입
  enterNextStage(socket, stage);

};

const enterNextStage = (socket, nextStage) => {
  const { dungeonInfo, player, screenText, battleLog } = nextStage;

  if(nextStage == -1) {     // 던전 종료(클리어)시 던전나가기
    const leaveDungeonResponse = createResponse('responseTown', 'S_Leave_Dungeon', {});
    socket.write(leaveDungeonResponse);
  } else {
    // 클라이언트에 생성할 스테이지 정보전달
    const enterDungeonResponse = createResponse('responseTown', 'S_Enter_Dungeon', { dungeonInfo, player, screenText, battleLog });
    socket.write(enterDungeonResponse);
  }


};

export { enterTownHandler, enterDungeonHandler, enterNextStage };
