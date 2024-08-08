import { getTownUserBySocket, getAllList } from '../../../session/town.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export const avatarMoveHandler = async ({ socket, payload }) => {
  const user = getTownUserBySocket(socket);

  const { posX, posY, posZ, rot } = payload.transform;

  const X = posX;
  const Y = posY;
  const Z = posZ;
  const ROT = rot;
  user.updatePosition(X, Y, Z, ROT);
  const transform = user.getPosition();
  const playerId = user.getPlayerId();
  
  const playersInTown = getAllList();
  playersInTown.forEach((user) => {
    const socket = user.getSocket();

    const cmoveResponse = createResponse('responseTown', 'S_Move', { playerId, transform });
    socket.write(cmoveResponse);
  });
};

export const avatarAnimationHandler = async ({ socket, payload }) => {
  const user = getTownUserBySocket(socket);
  const playerId = user.getPlayerId();
  const { animCode } = payload;

  const playersInTown = getAllList();
  playersInTown.forEach((user) => {
    const socket = user.getSocket();

    const cAnimationResponse = createResponse('responseTown', 'S_Animation', { playerId, animCode });
    socket.write(cAnimationResponse);
  });
};
