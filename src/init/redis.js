import { createClient } from 'redis';
import { config } from '../config/config.js';
import { getMapCodes, getMonsterStats, getTextInfo, getUserStats } from '../db/game/game.db.js';

export const redisClient = createClient({
  url: `redis://${config.databases.redis.user}:${config.databases.redis.password}@${config.databases.redis.host}:${config.databases.redis.port}/0`,
  legacyMode: true,
});

redisClient.on('connect', async () => {
  console.log('레디스 연결 완료');
  await loadRedisAssets();
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().then();

const loadRedisAssets = async () => {
  const userStats = await getUserStats();

  const mapCodes = await getMapCodes();

  const monsters = await getMonsterStats();

  const textInfo = await getTextInfo();

  await redisClient.set('userStats', userStats);

  await redisClient.set('mapCodes', mapCodes);

  await redisClient.set('monsters', monsters);

  await redisClient.set('textInfo', textInfo);
};

export const redisV4 = redisClient.v4;
