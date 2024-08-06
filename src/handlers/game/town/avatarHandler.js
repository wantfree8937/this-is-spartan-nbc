import getUserBySocket from "./";

const avatarMoveHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const { transfrom } = payload;

  const X = transfrom.posX;
  const Y = transfrom.posY;
  const Z = transfrom.posZ;

  
  

  console.log(payload);
};

const avatarAnimationHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const { animCode } = payload;


  
  console.log(payload);
};

export default { avatarMoveHandler, avatarAnimationHandler };
