class BattleLog {
  constructor(battleLogInfo) {
    this.msg = battleLogInfo.msg;
    this.typingAnimation = battleLogInfo.typingAnimation;
    this.btns = battleLogInfo.btns.map((btn) => new Btn(btn));
  }
}

class Btn {
  constructor(btn) {
    this.msg = btn.msg;
    this.enable = btn.enable;
  }
}

export { BattleLog, Btn };
