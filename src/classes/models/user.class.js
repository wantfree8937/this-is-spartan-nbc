import Stat from './stat.class.js';
import Transform from './transfrom.class.js';

class User {
  constructor(playerId, nickname, userClass, statInfo, transformInfo, socket) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.userClass = userClass;
    this.socket = socket;
    this.transformInfo = transformInfo;
    this.statInfo = new Stat(statInfo);
    this.lastUpdateTime = Date.now();
  }

  getPlayerId() {
    const PlayerId = this.playerId;

    return PlayerId;
  }

  updatePosition(x, y, z, Rot) {
    this.transformInfo.posX = x;
    this.transformInfo.posY = y;
    this.transformInfo.posZ = z;
    this.transformInfo.rot = Rot;
    this.lastUpdateTime = Date.now();
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
    const transform = this.getPosition();
    const statInfo = this.getStatInfo();

    const player = {
      playerId: this.playerId,
      nickname: this.nickname,
      class: this.userClass,
      transform: transform,
      statInfo: statInfo,
    };
    return player;
  }
}

export default User;
