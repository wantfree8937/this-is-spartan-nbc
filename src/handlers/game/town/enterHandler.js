import Transform from '../../../classes/models/transfrom.class.js';
import { addUserTown, getAllList, getFilteredList } from '../../../session/town.session.js';
import { addUser, getUserByNickname } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { addUserDB, getUserByNicknameDB } from './../../../db/user/user.db.js';

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
  console.log(payload);

  const dungeonPayload = {
    dungeonInfo: {
      dungeonCode: 5001,
      monsters: [
        {
          monsterIdx: 0,
          monsterModel: 2001,
          monsterName: '11',
          monsterHp: 150,
        },
      ],
    },
    player: {
      playerClass: 1001,
      playerLevel: 1,
      playerName: 'mush',
      playerFullHp: 100,
      playerFullMp: 40,
      playerCurHp: 100,
      playerCurMp: 40,
    },
    screenText: {
      msg: 'Welcome!',
      typingAnimation: false,
      alignment: {
        x: 0,
        y: 0,
      },
      textColor: {
        r: 255,
        g: 255,
        b: 255,
      },
      screenColor: {
        r: 0,
        g: 0,
        b: 0,
      },
    },
    battleLog: {
      msg: 'Battle started',
      typingAnimation: false,
      btns: [
        {
          msg: 'Attack',
          enable: true,
        },
        {
          msg: 'Defend',
          enable: true,
        },
      ],
    },
  };

  const enterDungeonResponse = createResponse('responseTown', 'S_Enter_Dungeon', dungeonPayload);
  socket.write(enterDungeonResponse);
};

export { enterTownHandler, enterDungeonHandler };
