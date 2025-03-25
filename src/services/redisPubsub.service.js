const Redis = require("ioredis")

class RedisPubSubService {
    constructor() {
        this.sub = new Redis("redis://default:612aUtf73URncNIhjD4eA22ztCOHK5tM@redis-17032.c81.us-east-1-2.ec2.redns.redis-cloud.com:17032");
        this.pub = new Redis("redis://default:612aUtf73URncNIhjD4eA22ztCOHK5tM@redis-17032.c81.us-east-1-2.ec2.redns.redis-cloud.com:17032");
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