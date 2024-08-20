import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket,
  townOutNotification,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 100;

class Town {
  constructor() {
    this.users = [];
    this.leaveUsers = [];
    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Town session is full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 1000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }
  getUsers() {
    return this.users;
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
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

export default Town;
