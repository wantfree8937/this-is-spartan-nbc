import { loadProtos } from './loadProtos.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';
import { getTownSession, initializeTownSession } from '../session/town.session.js';
import { loadGameAssets } from './assets.js';

const initServer = async () => {
  try {
    //  await loadGameAssets();
    initializeTownSession();
    await loadGameAssets();
    await loadProtos();
    const townSession = getTownSession();
    setInterval(() => {
      townSession.townOut();
    }, 1000);
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
