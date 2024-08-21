import { Tower, NextInfo } from './tower.class.js';
import { getRitualLevel } from '../../db/user/user.db.js';

class User {
  constructor(uuid, playerId, nickname, userClass, soul, coin, statInfo, transformInfo, socket) {
    this.characterUUID = uuid;
    this.playerId = playerId;
    this.nickname = nickname;
    this.userClass = userClass;
    this.soul = soul;
    this.coin = coin;
    this.socket = socket;
    this.transformInfo = transformInfo;
    this.statInfo = statInfo;
    this.lastUpdateTime = Date.now();
    this.tower;
  }

  async setTower(initStat) {
    // 유저의 총합레벨
    const ritualLevel = await getRitualLevel(this.playerId);

    // 플레이어 정보
    const player = this.buildPlayerInfo();

    // 업그레이드시 반영될 수치
    const nextLevel = this.statInfo.getLevel() + 1;
    const nextHp = this.statInfo.getHp() + 200;
    const nextAttack = this.statInfo.getAttack() + 50;
    const nextMagic = this.statInfo.getMagic() + 70;
    const next = new NextInfo(nextLevel, nextHp, nextAttack, nextMagic);

    // 업그레이드 비용
    const level = this.statInfo.getLevel();
    const upgradeCost = initStat.upgradeCost * level;

    // 보유 영혼 수
    const soul = this.soul;

    const tower = new Tower(ritualLevel, player, next, upgradeCost, soul );
    this.tower = tower;
  }

  getUUID() {
    const uuid = this.characterUUID;

    return uuid;
  }
  getPlayerId() {
    const PlayerId = this.playerId;

    return PlayerId;
  }
  getUserClass() {
    const userClass = this.userClass;

    return userClass;
  }
  getSocket() {
    const socket = this.socket;

    return socket;
  }
  getPosition() {
    const transform = this.transformInfo;

    return transform;
  }
  getStatInfo() {
    const statInfo = this.statInfo;
    return statInfo;
  }
  getHp() {
    return this.statInfo.getHp();
  }
  getMp() {
    return this.statInfo.getMp();
  }
  getCoin() {
    return this.coin;
  }
  getSoul() {
    return this.soul;
  }
  getTower() {
    return this.tower;
  }

  // 위치-좌표 업데이트 메서드
  updatePosition(x, y, z, Rot) {
    this.transformInfo.posX = x;
    this.transformInfo.posY = y;
    this.transformInfo.posZ = z;
    this.transformInfo.rot = Rot;
    this.lastUpdateTime = Date.now();
  }

  offeringSoul(cost) {
    this.soul = this.soul - cost;
    return this.soul;
  }

  addSoul(rewardSoul) {
    this.soul += rewardSoul;
    return this;
  }
  addCoin(rewardCoin) {
    this.coin += rewardCoin;
    return this;
  }
  
  setCoin(currCoin) {
    this.coin = currCoin;
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const speed = 1; // 속도 고정
    const distance = speed * timeDiff;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + distance,
      y: this.y + distance,
      z: this.z + distance,
    };
  }

  buildPlayerInfo() {
    const player = {
      playerId: this.playerId,
      nickname: this.nickname,
      class: this.userClass,
      transform: this.transformInfo,
      statInfo: this.statInfo,
    };
    return player;
  }
}

export default User;
