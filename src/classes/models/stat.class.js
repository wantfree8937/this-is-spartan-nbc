class Stat {
  constructor(statInfo) {
    this.level = 1;
    this.hp = statInfo.maxHp;
    this.maxHp = statInfo.maxHp;
    this.mp = statInfo.maxMp;
    this.maxMp = statInfo.maxMp;
    this.atk = statInfo.atk;
    this.def = statInfo.def;
    this.magic = statInfo.magic;
    this.speed = statInfo.speed;
  }
}

export default Stat;
