
export class Tower {
  constructor(ritualLevel, player, nextInfo, upgradeCost, soul) {
    this.ritualLevel = ritualLevel;
    this.player = player;
    this.nextInfo = nextInfo;
    this.upgradeCost = upgradeCost;
    this.soul = soul;
  }

  makeUpgradePacket() {
    const upgradePacket = {
      ritualLevel: this.ritualLevel,
      player: this.player,
      next: this.nextInfo,
      upgradeCost: this.upgradeCost,
      soul: this.soul,
    };

    return upgradePacket;
  }

  updateTower(towerInfo) {
    this.ritualLevel = towerInfo.ritualLevel;
    this.player = towerInfo.player;
    this.nextInfo = towerInfo.next;
    this.upgradeCost = towerInfo.upgradeCost;
    this.soul = towerInfo.soul;
  }

  getUpgradeCost() {
    return this.upgradeCost;
  }
  getNextInfo() {
    return this.nextInfo;
  }

}

export class NextInfo {
  constructor(nextLevel, nextHp, nextAttack, nextMagic) {
    this.level = nextLevel;
    this.hp = nextHp;
    this.atk = nextAttack;
    this.mag = nextMagic;
  }

  updateNextInfo(nextInfo) {
    this.level = nextInfo.level +1;
    this.hp = nextInfo.hp +200;
    this.atk = nextInfo.atk +50;
    this.mag = nextInfo.mag +70;
  }

}

export default { Tower, NextInfo };