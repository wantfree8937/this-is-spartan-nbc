import { getTownSession } from '../session/town.session.js';

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const townSession = getTownSession() // 게임 객체에서 해당 유저 제거
  townSession.addLeaveUsers(socket);
};
