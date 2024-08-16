
export class BattleLog {
  constructor(battleLog) {
    this.msg = battleLog.msg;
    this.typingAnimation = battleLog.typingAnimation;
    this.btns = battleLog.btns;
  }

  changeMsg(msg) {
    this.msg = msg;
  }

  getBtns() {
    return this.btns;
  }

  deleteBtns() {
    this.btns = [];
  }
}

export class Btn {
  constructor(msg, check) {
    this.msg = msg;
    this.enable = check;
  }

  disableBtn() {
    this.enable = false;
  }

}

export default { BattleLog, Btn };
