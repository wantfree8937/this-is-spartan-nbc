class Stat {
  constructor(statInfo) {
    this.level = statInfo.level;
    this.hp = statInfo.maxHp;
    this.maxHp = statInfo.maxHp;
    this.mp = statInfo.maxMp;
    this.maxMp = statInfo.maxMp;
    this.atk = statInfo.atk;
    this.def = statInfo.def;
    this.magic = statInfo.magic;
    this.speed = statInfo.speed;
  }

  getLevel() {
    return this.level;
  }
  getHp() {
    return this.hp;
  }
  getMp() {
    return this.mp;
  }
  getAttack() {
    return this.atk;
  }
  getMagic() {
    return this.magic;
  }

  setLevel(level) {
    this.level = level;
    this.setStatByLevel();
  }
  setStatByLevel() {
    this.maxHp += (200 * (this.level -1));
    this.hp = this.maxHp;
    this.atk += (50 * (this.level -1));
    this.magic += (70 * (this.level -1));
  }

  upgradeLevel() {
    this.level += 1;
    this.maxHp += 200;
    this.hp = this.maxHp;
    this.atk += 50;
    this.magic += 70;

    return this.level;
  }

}

export default Stat;
