const amqplib = require('amqplib');
const message = 'hello, iam a developer'

const run = async () => {
    try {
        const connection = await amqplib.connect('amqp://localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send message to consumer
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`message sent:`, message)
    } catch (error) {
        console.error(error)
    }
}

run().catch(err => console.log(err))