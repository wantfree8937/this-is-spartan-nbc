import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.lastUpdateTime = Date.now();
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
