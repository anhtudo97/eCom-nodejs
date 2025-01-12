const Redis = require("ioredis")

class RedisPubSubService {
    constructor() {
        this.sub = new Redis("redis://default:uJyNAZ99dxLuwQ7615qP1cOFosPQr0Cz@redis-12124.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:12124");
        this.pub = new Redis("redis://default:uJyNAZ99dxLuwQ7615qP1cOFosPQr0Cz@redis-12124.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:12124");
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