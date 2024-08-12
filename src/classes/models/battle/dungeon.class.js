import { BattleLog } from './battleLog.class.js';
import { DungeonInfo } from './dugeonInfo.class.js';
import Player from './player.class.js';
import { ScreenText } from './screenText.class.js';

const MAX_PLAYERS = 2;

class Dungeon {
  constructor(id, dungeonInfo, user, textInfo, battleLogInfo) {
    this.id = id;
    this.users = [];
    this.dungeonInfo = new DungeonInfo(dungeonInfo);
    this.player = new Player(user);
    this.screenText = new ScreenText(textInfo);
    this.battleLog = new BattleLog(battleLogInfo);
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Dungeon session is full');
    }
    this.users.push(user);
  }

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

  buildDungeonInfo() {
    const dungeon = {
      dungeonInfo: this.dungeonInfo,
      player: this.player,
      screenText: this.screenText,
      battleLog: this.battleLog,
    };
    return dungeon;
  }
}

export default Dungeon;
