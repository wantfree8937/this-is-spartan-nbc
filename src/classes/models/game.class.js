import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket,
  townOutNotification,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.leaveUsers = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);

    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  }

  addLeaveUsers(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    this.leaveUsers.push(this.users[index]);
  }

  townOut() {
    if (this.leaveUsers.length > 0) {
      const removedUserIds = [];
      this.leaveUsers.forEach((leaveUser) => {
        const index = this.users.findIndex((user) => user.playerId === leaveUser.playerId);
        if (index !== -1) {
          this.users.splice(index, 1);
          removedUserIds.push(leaveUser.playerId);
        }
      });

      this.leaveUsers = [];

      const despawnPacket = townOutNotification(removedUserIds);

      this.users.forEach((user) => {
        user.socket.write(despawnPacket);
      });
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  getAllLocation() {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { id: user.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
