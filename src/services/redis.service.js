'use strict'

const Redis = require('ioredis')
// const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
// const redisClient = redis.createClient({
//     url: "redis://default:TSDih0CCfUTVu5eaD4OH23K7cgyVvfEL@redis-16761.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:16761"
// })
// redisClient.connect();
const redisClient = new Redis("redis://default:TSDih0CCfUTVu5eaD4OH23K7cgyVvfEL@redis-16761.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:16761")

// const pexpire = promisify(redisClient.pExpire).bind(redisClient)
// const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

redisClient.ping((err, result) => {
    if (err) {
        console.error('Error connecting to Redis::', err)
    } else {
        console.log('Connected to Redis')
    }
})

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10
    const expireTime = 3000;

    for (let i = 0; i < retryTimes.length; i++) {
        // create a key, tx have key will checkout
        // const result = await setnxAsync(key, expireTime)
        const result = await redisClient.setnx(key, expireTime)
        console.log(`result::`, result)
        if (result === 1) {
            // action with inventory
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })

            if (isReservation.modifiedCount) {
                redisClient.pexpire(key, expireTime)
                // await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    // const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return redisClient.del(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}