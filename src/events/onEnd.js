import { removeUser } from '../session/user.session.js';
import { getGameSession } from '../session/game.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const gameSession = getGameSession(1) // 게임 객체에서 해당 유저 제거
  gameSession.addLeaveUsers(socket);
};
