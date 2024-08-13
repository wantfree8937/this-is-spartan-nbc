import { ActionSet } from './actionSet.class.js';

class PlayerAction {
  constructor(monsterIdx, playerAnim, effect) {
    this.targetMonsterIdx = monsterIdx;
    this.actionSet = new ActionSet(playerAnim, effect);
  }
}

export { PlayerAction };
