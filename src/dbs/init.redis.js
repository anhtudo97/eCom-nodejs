'use strict'

const Redis = require("ioredis");
const { REDIS_URL } = require("../utils");

let client = {}
const statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
}

const handleEventConnect = (connectionRedis) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connection Redis - Connection status: connected')
    })
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connection Redis - Connection status: disconnected')
    })
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connection Redis - Connection status: reconnecting')
    })
    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log('connection Redis - Connection status: error' + err)
    })
}

const initRedis = async () => {
    const instanceRedis = new Redis(REDIS_URL, { retryStrategy: null })

    console.log("run redis")
    // await instanceRedis.connect()
    handleEventConnect(instanceRedis)
    client = instanceRedis
}

const getRedis = () => {

}

const closeRedis = async () => {
    await client.quit()
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}