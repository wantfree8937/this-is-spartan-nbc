import { createResponse } from '../../../utils/response/createResponse.js';

export const screenDoneHandler = ({ socket, payload }) => {
  const screenDoneResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(screenDoneResponse);
};

export const selectCheckHandler = ({ socket, payload }) => { 
  // 클라이언트가 선택한 버튼 값 1~6 / 0은 버튼이 아님
  const { responseCode } = payload;
  console.log('responseCode:', responseCode);

  switch (responseCode) {
    case 1:
      console.log('1번 버튼을 선택함.');
        
      break;
    case 2:
      console.log('2번 버튼을 선택함.');

      break;
    case 3:
      console.log('3번 버튼을 선택함.');

      break;
    case 4:
      console.log('4번 버튼을 선택함.');

      break;
    case 5:
      console.log('5번 버튼을 선택함.');

      break;
    case 6:
      console.log('6번 버튼을 선택함.');

      break;
    default:
      console.log('버튼이 선택되지 않음.');
  }









  const resultResponse = createResponse('responseBattle', 'S_Screen_Done');
  socket.write(resultResponse);
};

export default { screenDoneHandler, selectCheckHandler };