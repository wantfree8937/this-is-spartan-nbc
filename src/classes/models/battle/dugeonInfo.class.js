class DungeonInfo {
  constructor(dungeonInfo) {
    this.dungeonCode = dungeonInfo.dungeonCode;
    this.monsters = dungeonInfo.monsters.map((monster) => new Monster(monster));
  }
}

class Monster {
  constructor(monsterInfo) {
    this.monsterIdx = monsterInfo.monsterIdx;
    this.monsterModel = monsterInfo.monsterModel;
    this.monsterName = monsterInfo.monsterName;
    this.monsterHp = monsterInfo.monsterHp;
  }
}

export { DungeonInfo, Monster };
