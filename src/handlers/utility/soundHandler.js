import { createResponse } from '../../utils/response/createResponse.js';

export const buildPlaySoundPacket = (soundName) => {
  const playSoundResponse = createResponse('responseSound', 'S_Play_Sound', {
    soundName: `${soundName}`,
  });
  return playSoundResponse;
};

export const buildMonsterAttackSoundPacket = (monsterIdx) => {
  const swordsMan = [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 22, 23, 24];
  const axeMan = [6, 14, 20, 26];
  const hammerMan = [7, 15, 21, 27];
  const archer = [4, 12, 18];
  const magician = [5, 13, 19, 25];
  const boss = [28];
  let monsterName;

  if (swordsMan.includes(monsterIdx)) {
    monsterName = 'SwordsMan';
  } else if (axeMan.includes(monsterIdx)) {
    monsterName = 'AxeMan';
  } else if (hammerMan.includes(monsterIdx)) {
    monsterName = 'HammerMan';
  } else if (archer.includes(monsterIdx)) {
    monsterName = 'Archer';
  } else if (magician.includes(monsterIdx)) {
    monsterName = 'Magician';
  } else if (boss.includes(monsterIdx)) {
    monsterName = 'Boss';
  } else {
    monsterName = 'Unknown';
  }
  const monsterAttackSoundResponse = createResponse('responseSound', 'S_Play_Sound', {
    soundName: `attack_${monsterName}`,
  });
  return monsterAttackSoundResponse;
};

export const buildPlayerAttackPacket = (userClass) => {
  const characters = ['Cerbe', 'Uni', 'Nix', 'Chad', 'Miho', 'Levi', 'Wyv', 'Drago', 'Kiri'];
  const charName = characters[userClass - 1001];
  const attackSoundResponse = createResponse('responseSound', 'S_Play_Sound', {
    soundName: `attack_${charName}`,
  });
  return attackSoundResponse;
};
