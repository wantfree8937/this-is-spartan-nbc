import { getUserBySocket } from "../../../session/user.session.js";
import { createResponse } from "../../../utils/response/createResponse.js";

export const avatarMoveHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  
  const { posX, posY, posZ, rot } = payload.transform;

  const X = posX;
  const Y = posY;
  const Z = posZ;
  const ROT = rot;
  user.updatePosition(X, Y, Z, ROT);
  const transform = user.getPosition();
  const playerId = user.getPlayerId();

  const cmoveResponse = createResponse('responseTown', 'S_Move', { playerId, transform });
  socket.write(cmoveResponse);
};

export const avatarAnimationHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const playerId = user.getPlayerId();
  const { animCode } = payload;

  const cAnimationResponse = createResponse('responseTown', 'S_Animation', { playerId, animCode });
  socket.write(cAnimationResponse);
};
