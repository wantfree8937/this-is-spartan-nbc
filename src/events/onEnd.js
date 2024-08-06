import { removeUser } from '../session/user.session.js';
import { getGameSession } from '../session/game.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  
  // removeUser(socket); // 유저 세션에서 해당 유저제거

  // const gameSession = getGameSession() // 게임 객체에서 해당 유저 제거
  // gameSession.removeUser(socket);

  // outOfTownHandler(socket); // 소켓 연결이 종료되면 마을을 나간 것이기 때문에 outOfTownHandler 작동
};
