
export class BattleLog {
  constructor(battleLog) {
    this.msg = battleLog.msg;
    this.typingAnimation = battleLog.typingAnimation;
    this.btns = battleLog.btns
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
  addBtn(msg, enable) {
    this.btns.push(new Btn(msg, enable));
  }

  disableBtns() {
    this.btns.forEach(btn => btn.disableBtn());
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
  enableBtn() {
    this.enable = true;
  }

}

export default { BattleLog, Btn };
