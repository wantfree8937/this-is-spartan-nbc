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

  getNextSequence() {
    return ++this.sequence;
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const speed = 1; // 속도 고정
    const distance = speed * timeDiff;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + distance,
      y: this.y,
    };
  }
}

export default User;
