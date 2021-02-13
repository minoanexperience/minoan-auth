const Redis = require('redis');
const Promise = require('bluebird');

const redisClient = Redis.createClient({
    port: sails.config.custom.redisPort,
    host: sails.config.custom.redisHost,
    db: sails.config.custom.redisDB,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = {

    /**
     * Insert data in redis
     */

    setData: (key, value, time) => {
        redisClient.set(key, JSON.stringify(value));
        if (time) {
            redisClient.expire(key, time);
        }
    },

    /**
     * Fetch data from redis
     */

    getData: async (key) => {
        return new Promise((resolve, reject) => {
            redisClient.get(key, (err, result) => {
                if (err) reject(err);
                if (result) {
                    resolve(JSON.parse(result))
                } else {
                    reject()
                }
            });
        });
    },

    /**
     * Remove redis data
     */

    removeData: (key) => {
        return new Promise((resolve, reject) => {
            redisClient.del(key, (err, result) => {
                if (err) reject(err);
                resolve(JSON.parse(result));
            });
        });
    },

};
