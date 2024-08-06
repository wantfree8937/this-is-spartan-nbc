import { getUserBySocket } from '../../../session/user.session';
import { createResponse } from '../../../utils/response/createResponse.js';

const outOfTownHandler = async (socket) => {
  //   console.log(payload);
  //   const user = getUserBySocket();

  const playerIds = [];

  //   const outOfTownResponse = createResponse('responseTown', 'S_Despawn', { playerIds });
  //   socket.write(outOfTownResponse);
};

export default outOfTownHandler;
