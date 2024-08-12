class Player {
  constructor(user) {
    this.playerClass = user.userClass;
    this.playerLevel = user.statInfo.level;
    this.playerName = user.nickname;
    this.playerFullHp = user.statInfo.maxHp;
    this.playerFullMp = user.statInfo.maxMp;
    this.playerCurHp = user.statInfo.hp;
    this.playerCurMp = user.statInfo.mp;
  }
}

export default Player;
