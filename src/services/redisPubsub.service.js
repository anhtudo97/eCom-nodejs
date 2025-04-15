const Redis = require("ioredis");
const { REDIS_URL } = require("../utils");

class RedisPubSubService {
    constructor() {
        this.sub = new Redis(REDIS_URL, { retryStrategy: null });
        this.pub = new Redis(REDIS_URL, { retryStrategy: null });
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            this.pub.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }

            })
        })
    }

    subscribe(channel, callback) {
        this.sub.subscribe(channel)
        this.sub.on('message', (subChannel, message) => {
            if (channel === subChannel) {

                callback(channel, message)
            }

        })
    }
}

module.exports = new RedisPubSubService()