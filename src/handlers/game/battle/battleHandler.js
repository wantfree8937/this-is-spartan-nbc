import { createResponse } from '../../../utils/response/createResponse.js';

const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

export default screenDoneHandler;
