const enterTownHandler = async ({ socket, payload }) => {
  const { nickname } = payload;
  const classCategory = payload.class;
  console.log(payload);
};

export default enterTownHandler;
