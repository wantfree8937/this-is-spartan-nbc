
export class BattleLog {
  constructor(battleLog) {
    this.msg = battleLog.msg;
    this.typingAnimation = battleLog.typingAnimation;
    this.btns = battleLog.btns;
  }
}

export class Btn {
  constructor(msg, check) {
    this.msg = msg;
    this.enable = check;
  }
}

export default { BattleLog, Btn };
