import { createResponse } from '../../../utils/response/createResponse.js';

export const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

export const selectCheckHandler = ({ socket, payload }) => { 
  // 클라이언트가 선택한 버튼 값 1~6 / 0은 버튼이 아님
  const { responseCode } = payload;
  
  console.log('responseCode:', responseCode);



  const resultResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(resultResponse);
};

export default { screenDoneHandler, selectCheckHandler };