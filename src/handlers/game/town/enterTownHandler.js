import { getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

const enterTownHandler = async ({ socket, payload }) => {
  const { nickname } = payload;
  const classCategory = payload.class;
  const playerInfo = {};
  const enterTownResponse = createResponse('responseTown', 'S_Enter', {
    player: playerInfo,
  });
};

export default enterTownHandler;
