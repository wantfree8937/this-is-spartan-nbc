export class DungeonInfo {
  constructor(dungeonInfo) {
    this.dungeonCode = dungeonInfo.dungeonCode;
    this.monsters = dungeonInfo.monsters.map((monster) => new Monster(monster));
  }
}

export class Monster {
  constructor(monsterInfo) {
    this.monsterIdx = monsterInfo.monsterIdx;
    this.monsterModel = monsterInfo.monsterModel;
    this.monsterName = monsterInfo.monsterName;
    this.monsterHp = monsterInfo.monsterHp;
  }

  getName() {
    return this.monsterName;
  }

  setBossStat(statBoost) {
    this.monsterHp = (this.monsterHp * statBoost);
  }
}

export default { DungeonInfo, Monster };
