
const amqplib = require('amqplib');

const run = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send message to consumer
        channel.consume(queueName, message => {
            console.log(`Received ${message.content.toString()}`)
        }, {
            ack: true
        })
    } catch (error) {
        console.error(error)
    }
}

run().catch(err => console.log(err))