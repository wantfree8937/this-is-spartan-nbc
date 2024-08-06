import { getUserBySocket } from "../../../session/user.session.js";
import { createResponse } from "../../../utils/response/createResponse.js";

export const avatarMoveHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  console.log('user:', user);
  
  console.log('payload:', payload);
  console.log('payload.transform:', payload.transform);
  const { posX, posY, posZ } = payload.transform;

  const X = posX;
  const Y = posY;
  const Z = posZ;

  console.log('X/Y/Z:', X, Y, Z);

  user.updatePosition(X, Y, Z);
  const posNow = user.getPosition();

  const packet = createResponse('town', 'S_Move', posNow);
  socket.write(packet);
};

export const avatarAnimationHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const { animCode } = payload;

  //user.setAnimation(animCode);

  
  console.log(payload);
};
