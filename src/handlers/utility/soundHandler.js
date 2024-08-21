import { createResponse } from '../../utils/response/createResponse.js';

export const buildPlaySoundPacket = (soundName) => {
  const playSoundResponse = createResponse('responseSound', 'S_Play_Sound', {
    soundName: `${soundName}`,
    volume: 0.3,
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
  let volume;
  console.log('몬스터 ID', monsterIdx);

  if (swordsMan.includes(monsterIdx)) {
    monsterName = 'SwordsMan';
    volume = 0.1;
  } else if (axeMan.includes(monsterIdx)) {
    monsterName = 'AxeMan';
    volume = 0.6;
  } else if (hammerMan.includes(monsterIdx)) {
    monsterName = 'HammerMan';
    volume = 0.3;
  } else if (archer.includes(monsterIdx)) {
    monsterName = 'Archer';
    volume = 0.2;
  } else if (magician.includes(monsterIdx)) {
    monsterName = 'Magician';
    volume = 0.6;
  } else if (boss.includes(monsterIdx)) {
    monsterName = 'Boss';
    volume = 0.25;
  } else {
    monsterName = 'Unknown';
  }
  const monsterAttackSoundResponse = createResponse('responseSound', 'S_Play_Sound', {
    soundName: `attack_${monsterName}`,
    volume: volume,
  });
  return monsterAttackSoundResponse;
};

export const buildPlayerAttackPacket = (userClass) => {
  const characters = ['Cerbe', 'Uni', 'Nix', 'Chad', 'Miho', 'Levi', 'Wyv', 'Drago', 'Kiri'];
  const charName = characters[userClass - 1001];
  let volume = 0.4;
  if (charName === 'Cerbe') {
    volume = 0.6;
  }
  if (charName === 'Uni') {
    volume = 0.6;
  }

  const attackSoundResponse = createResponse('responseSound', 'S_Play_Sound', {
    soundName: `attack_${charName}`,
    volume: volume,
  });
  return attackSoundResponse;
};
