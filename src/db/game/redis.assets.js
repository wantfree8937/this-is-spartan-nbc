import { redisV4 } from '../../init/redis.js';

export const getMonstersRedis = async () => {
  const monstersJson = await redisV4.get('monsters');
  const monstersData = JSON.parse(monstersJson);
  return monstersData;
};
