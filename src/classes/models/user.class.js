import Stat from './stat.class.js';
import Transform from './transfrom.class.js';

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
    this.statInfo = new Stat(statInfo);
    this.lastUpdateTime = Date.now();
  }
  getUUID() {
    const uuid = this.characterUUID;

    return uuid;
  }

  getPlayerId() {
    const PlayerId = this.playerId;

    return PlayerId;
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

  // 위치-좌표 업데이트 메서드
  updatePosition(x, y, z, Rot) {
    this.transformInfo.posX = x;
    this.transformInfo.posY = y;
    this.transformInfo.posZ = z;
    this.transformInfo.rot = Rot;
    this.lastUpdateTime = Date.now();
  }

  minusSoul(cost) {
    this.soul -= cost;
  }

  addSoul(rewardSoul) {
    this.soul += rewardSoul;
    return this;
  }
  addCoin(rewardCoin) {
    this.coin += rewardCoin;
    return this;
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
