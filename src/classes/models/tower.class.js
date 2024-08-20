
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

  updateTower(totalLevel, playerInfo, nextCost, leftSoul) {
    this.ritualLevel = totalLevel;
    this.player = playerInfo;
    this.nextInfo.updateNextInfo();
    this.upgradeCost = nextCost;
    this.soul = leftSoul;
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

  updateNextInfo() {
    this.level += 1;
    this.hp += 200;
    this.atk += 50;
    this.mag += 70;
  }

}

export default { Tower, NextInfo };