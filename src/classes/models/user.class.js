import { createPingPacket } from '../../utils/notification/game.notification.js';
import Stat from './stat.class.js';

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

  getPosition() {
    const transform = this.transformInfo;

    return transform;
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
}

export default User;
