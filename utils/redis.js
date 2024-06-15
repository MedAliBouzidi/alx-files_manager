const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor () {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error}`);
    });
  }

  isAlive () {
    return this.client.connected;
  }

  async get (key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  async set (key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  async del (key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
