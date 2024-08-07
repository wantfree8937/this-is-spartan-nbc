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
  /*---------Enter--------*/
  const { nickname } = payload;
  const userClass = payload.class;

  const playerId = uuidv4();

  const classStats = getClassStats(userClass);
  const transform = new Transform();

  const user = addUser(playerId, nickname, userClass, transform, socket);
  const townUser = addUserTown(user);
  const player = townUser.buildPlayerInfo();

  const enterTownResponse = createResponse('responseTown', 'S_Enter', { player });
  socket.write(enterTownResponse);

  /*---------Spawn--------*/

  const players = [];
  const filteredUserList = getFilteredList(playerId);
  console.log('필터된 유저들 :', filteredUserList);

  filteredUserList.forEach((user) => {
    const player = user.buildPlayerInfo();
    players.push(player);
  });

  const spawnUserResponse = createResponse('responseTown', 'S_Spawn', { players });
  //받아온 정보를 반복문으로 transform으로 생성하는 위치만
  socket.write(spawnUserResponse);
};

export default enterTownHandler;
