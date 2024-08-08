import { getAllTownSocket, getTownUserByNickname } from '../../session/town.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const chatHandler = ({ socket, payload }) => {
  // 1. 채팅을 친 유저가 보낸 payload 객체구조분해할당
  const { playerId, senderName, chatMsg } = payload;
  // 2. 유저들에게 보낼 응답 패킷 생성
  const chatResponse = createResponse('responseTown', 'S_Chat', { playerId, chatMsg });

  // 3. 유저의 위치가 town인 경우를 확인
  const ExistUserInTown = getTownUserByNickname(senderName);
  // 4. 유저의 위치가 dungeon인 경우를 확인
  //   const ExistUserInDungeon = getDungeonUserByNickname(senderName);

  if (ExistUserInTown) {
    // 5. 유저가 town에 있는 경우 townSession에 저장된 user들의 socket을 가져옴
    const sockets = getAllTownSocket();
    // 6. socket 별로 응답 패킷을 전송
    sockets.forEach((socket) => socket.write(chatResponse));

    //   } else if (ExistUserInDungeon) {
    // 7. 유저가 dungeon에 있는 경우 dungeonSession에 저장된 user들의 socket을 가져옴
    //     const sockets = getAllDungeonSocket();
    // 8. socket 별로 응답 패킷을 전송
    //     sockets.forEach((socket) => socket.write(chatResponse));
  }
};

export default chatHandler;

/*
추후 dungeonClass, dungeonSession을 만들면 주석(4,7,8) 제거
*/
up;
