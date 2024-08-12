import Transform from '../../../classes/models/transfrom.class.js';
import { addUserTown, getAllList, getFilteredList } from '../../../session/town.session.js';
import { addUser, getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { loadGameAssets } from '../../../init/assets.js';
import { v4 as uuidv4 } from 'uuid';
import { createDungeonSession } from '../../../session/dungeon.session.js';

const enterTownHandler = async ({ socket, payload }) => {
  /*---------Enter--------*/
  const { nickname } = payload;
  const userClass = payload.class;

  const playerId = nickname;

  const transform = new Transform();
  const user = addUser(playerId, nickname, userClass, transform, socket);
  const townUser = addUserTown(user);

  const player = townUser.buildPlayerInfo();

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });
  socket.write(enterTownResponse);

  /*---------Spawn--------*/

  //towerSession에서 가져온 유저
  const X = -4.5;
  const Y = 0.8;
  const Z = 136;
  const ROT = 0;
  townUser.updatePosition(X, Y, Z, ROT);
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
  console.log(payload); // 던전 난이도 코드
  const user = getUserBySocket(socket);

  const dungeonId = uuidv4(); // 던전 임시 id
  const dungeonSession = createDungeonSession(dungeonId, user);
  const dungeon = dungeonSession.buildDungeonInfo();

  const enterDungeonResponse = createResponse('responseTown', 'S_Enter_Dungeon', dungeon );
  socket.write(enterDungeonResponse);
};

export { enterTownHandler, enterDungeonHandler };
