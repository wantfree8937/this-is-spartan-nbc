// 서버 초기화 작업
//  import { loadGameAssets } from './assets.js';
import { loadProtos } from './loadProtos.js';
import { addGameSession, getGameSession } from '../session/game.session.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';

const initServer = async () => {
  try {
    //  await loadGameAssets();
    await loadProtos();
    addGameSession(1);
    const townSession = getGameSession(1);
    setInterval(() => {
      townSession.townOut();
      console.log('작동중');
    }, 5000);
    await testAllConnections(pools);
    // 다음 작업
  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
