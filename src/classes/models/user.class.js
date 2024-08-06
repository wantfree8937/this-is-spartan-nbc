import { createPingPacket } from '../../utils/notification/game.notification.js';
import Stat from './stat.class.js';

class User {
  constructor(playerId, nickname, userClass, statInfo, socket) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.userClass = userClass;
    this.socket = socket;
    this.x = 0;
    this.y = 1;
    this.z = 0;
    this.statInfo = new Stat(statInfo);
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.lastUpdateTime = Date.now();
  }

  getPosition() {
    const X = this.x;
    const Y = this.y;
    const Z = this.z;
    
    this.lastUpdateTime = Date.now();
    const updateTime = this.lastUpdateTime;

    return { X, Y, Z, updateTime };
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
