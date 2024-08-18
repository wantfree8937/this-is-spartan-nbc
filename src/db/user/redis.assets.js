import { redisV4 } from '../../init/redis.js';

export const getUserRedis = async () => {
  const userStatJson = await redisV4.get('userStats');
  const characterStat = JSON.parse(userStatJson);
  return characterStat;
};
