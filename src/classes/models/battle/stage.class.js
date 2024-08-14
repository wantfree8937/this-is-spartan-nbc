import { DungeonInfo } from './dungeonInfo.class.js';
import { Player } from './player.class.js';
import { ScreenText } from './screenText.class.js';
import { BattleLog } from './battleLog.class.js';

const MAX_PLAYERS = 1;

class Stage {
  constructor(id, dungeonInfo, user, textInfo, battleLog) {
    this.id = id;
    this.dungeonInfo = new DungeonInfo(dungeonInfo);
    this.player = new Player(user);
    this.screenText = new ScreenText(textInfo);
    this.battleLog = new BattleLog(battleLog);
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Dungeon session is full');
    }
    this.users.push(user);
  }

  // 정보반환(get) 함수들
  getDungeonInfo() {
    const dungeonInfo = this.dungeonInfo;
    return dungeonInfo;
  }
  getPlayer() {
    const player = this.player;
    return player;
  }
  getScreenText() {
    const screenText = this.screenText;
    return screenText;
  }
  getBattleLog() {
    const battleLog = this.battleLog;
    return battleLog;
  }

  buildStageInfo() {
    const dungeon = {
      dungeonInfo: this.dungeonInfo,
      player: this.player,
      screenText: this.screenText,
      battleLog: this.battleLog,
    };
    return dungeon;
  }
}

export default Stage;
