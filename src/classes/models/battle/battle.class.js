import { BattleLog } from './battleInfo/battleLog.class.js';
import { MonsterAction } from './battleInfo/monsterAction.class.js';
import { PlayerAction } from './battleInfo/playerAction.class.js';
import { SetMonsterHp } from './battleInfo/setMonsterHp.class.js';
import { SetPlayerHp } from './battleInfo/setPlayerHp.class.js';
import { SetPlayerMp } from './battleInfo/setPlayerMp.class.js';

class Battle {
  constructor(
    battleLogInfo,
    setPlayerHpInfo,
    setPlayerMpInfo,
    setMonsterHpInfo,
    playerActionInfo,
    monsterActionInfo,
  ) {
    this.battleLog = new BattleLog(battleLogInfo);
    this.setPlayerHp = new SetPlayerHp(setPlayerHpInfo);
    this.setPlayerMp = new SetPlayerMp(setPlayerMpInfo);
    this.setMonsterHp = new SetMonsterHp(setMonsterHpInfo);
    this.playerAction = new PlayerAction(playerActionInfo);
    this.monsterAction = new MonsterAction(monsterActionInfo);
  }

  //   getDungeonInfo() {
  //     const dungeonInfo = this.dungeonInfo;

  //     return dungeonInfo;
  //   }

  //   getPlayer() {
  //     const player = this.player;

  //     return player;
  //   }

  //   getScreenText() {
  //     const screenText = this.screenText;

  //     return screenText;
  //   }

  //   getBattleLog() {
  //     const battleLog = this.battleLog;

  //     return battleLog;
  //   }

  //   buildDungeonInfo() {
  //     const dungeon = {
  //       dungeonInfo: this.dungeonInfo,
  //       player: this.player,
  //       screenText: this.screenText,
  //       battleLog: this.battleLog,
  //     };
  //     return dungeon;
  //   }
}

export default Battle;
