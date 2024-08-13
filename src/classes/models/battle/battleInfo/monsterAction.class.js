import { ActionSet } from './actionSet.class.js';

class MonsterAction {
  constructor(monsterIdx, monsterAnim, effect) {
    this.actionMonsterIdx = monsterIdx;
    this.actionSet = new ActionSet(monsterAnim, effect);
  }
}

export { MonsterAction };
