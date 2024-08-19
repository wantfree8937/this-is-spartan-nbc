import { redisV4 } from '../../init/redis.js';

export const getMonstersRedis = async () => {
  const monstersJson = await redisV4.get('monsters');
  const monstersData = JSON.parse(monstersJson);
  return monstersData;
};

export const getUserStatsRedis = async () => {
  const userStatJson = await redisV4.get('userStats');
  const characterStat = JSON.parse(userStatJson);
  return characterStat;
};
