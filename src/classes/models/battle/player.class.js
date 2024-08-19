export class Player {
  constructor(user) {
    this.playerClass = user.userClass;
    this.playerLevel = user.statInfo.level;
    this.playerName = user.nickname;
    this.playerFullHp = user.statInfo.maxHp;
    this.playerFullMp = user.statInfo.maxMp;
    this.playerCurHp = user.statInfo.hp;
    this.playerCurMp = user.statInfo.mp;
  }

  getHpNow() {
    return this.playerCurHp;
  }
  getMpNow() {
    return this.playerCurMp;
  }

  updatePlayerHp(hp) {
    this.playerCurHp = this.playerCurHp + hp;
  }
  updatePlayerMp(mp) {
    this.playerCurMp = this.playerCurMp + mp;
  }

  setHpZero() {
    this.playerCurHp = 0;
  }
}

export default Player;
