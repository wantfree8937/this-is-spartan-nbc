

const avatarMoveHandler = async ({ socket, payload }) => {
  const { userId } = payload;
  
  console.log(payload);
};

const avatarAnimationHandler = async ({ socket, payload }) => {
  const { userId } = payload;
  
  console.log(payload);
};

export default { avatarMoveHandler, avatarAnimationHandler };
