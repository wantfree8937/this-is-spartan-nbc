export class DungeonInfo {
  constructor(dungeonInfo) {
    this.dungeonCode = dungeonInfo.dungeonCode;
    this.monsters = dungeonInfo.monsters.map((monster) => new Monster(monster));
  }

  getMonsters() {
    return this.monsters;
  }
}

export class Monster {
  constructor(monsterInfo) {
    this.monsterIdx = monsterInfo.monsterIdx;
    this.monsterModel = monsterInfo.monsterModel;
    this.monsterName = monsterInfo.monsterName;
    this.monsterHp = monsterInfo.monsterHp;
  }

  getIdx() {
    return this.monsterIdx;
  }
  getName() {
    return this.monsterName;
  }
  getHp() {
    return this.monsterHp;
  }

  damageMonsterHp(hp) {
    this.monsterHp = this.monsterHp - hp;
  }
  setHpZero() {
    this.monsterHp = 0;
  }

}

export default { DungeonInfo, Monster };
