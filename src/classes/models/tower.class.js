
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

}

export class NextInfo {
  constructor(nextLevel, nextHp, nextAttack, nextMagic) {
    this.level = nextLevel;
    this.hp = nextHp;
    this.atk = nextAttack;
    this.mag = nextMagic;
  }

  updateNextInfo(nextInfo) {
    this.level = nextInfo.level;
    this.hp = nextInfo.hp;
    this.atk = nextInfo.atk;
    this.mag = nextInfo.mag;
  }

}

export default { Tower, NextInfo };