const amqplib = require('amqplib');

// const log = console.log
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const run = async () => {
    try {
        const connection = await amqplib.connect('amqp://localhost')
        const channel = await connection.createChannel()

        // 1. create a exchange
        const notificationExchange = 'notificationExchange' // exchange direct
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2. create a queue
        const notificationQueue = 'notificationQueueProcess' // queue main process
        const notificationExchangeDLX = 'notificationExchangeDLX' // exchange for DLX - dead letter exchange
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // routing key for DLX     
        const queueResult = await channel.assertQueue(notificationQueue, {
            durable: true,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3. bind queue to exchange
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4. send message to consumer
        const message = 'a new product'
        channel.sendToQueue(notificationQueue, Buffer.from(message), {
            // persistent: true, // ensure message will not be lost even if rabbitmq restarts
            expiration: 9000 // message will be dead after 10 seconds
        })
        console.log(`[x] Sent ${message}`)

        // 5. close connection after sending message
        // await connection.close()
        // process.exit(0)

        // 6. handle DLX queue
        // channel.consume(notificationQueue, message => {
        //     console.log(`[x] Received ${message.content.toString()}`)
        // }, {
        //     noAck: false, // keep the message in queue until consumer acknowledges it
        //     consumerTag: 'dlxConsumer'
        // })

        setTimeout(async () => {
            await connection.close()
            process.exit(0)
        }, 1000);
    } catch (error) {
        console.error(error)
    }
}

run().catch(err => console.log(err))