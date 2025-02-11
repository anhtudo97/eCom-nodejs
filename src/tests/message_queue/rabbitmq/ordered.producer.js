const amqplib = require('amqplib');
const message = 'hello, iam a developer'

const run = async () => {
    try {
        const connection = await amqplib.connect('amqp://localhost')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queued-messages'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send message to consumer
        for (let i = 0; i < 10; i++) {
            const message = `ordered-queued-messages::: ${i}`
            console.log(`message: ${message}`)
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true // ensure message will not be lost even if rabbitmq restarts
            })

        }

        setTimeout(async () => {
            await connection.close()
            process.exit(0)
        }, 1000);
    } catch (error) {
        console.error(error)
    }
}

run().catch(err => console.log(err))