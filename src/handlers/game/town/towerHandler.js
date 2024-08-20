import { getUserBySocket } from '../../../session/user.session.js';

export const characterUpgradeHandler = async ({ socket, payload }) => {
  console.log('TestCode #47::', payload);
  const user = getUserBySocket();
  user.buildPlayerInfo();
  socket.write();
};
