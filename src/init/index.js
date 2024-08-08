import { loadProtos } from './loadProtos.js';
import { addGameSession, getGameSession } from '../session/game.session.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';
import { initializeTownSession } from '../session/town.session.js';

const initServer = async () => {
  try {
    //  await loadGameAssets();
    initializeTownSession();
    await loadProtos();
    addGameSession(1);
    const townSession = getGameSession(1);
    setInterval(() => {
      townSession.townOut();
      console.log('작동중');
    }, 5000);
    await testAllConnections(pools);
    // 다음 작업

    // 유저세션, 타운세션 생성
    // 접소과 동시에 양쪽 세션에 유저추가
  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
