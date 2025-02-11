
const amqplib = require('amqplib');

const run = async () => {
    try {
        const connection = await amqplib.connect('amqp://@localhost')
        const channel = await connection.createChannel()

        const queueName = 'ordered-queued-messages'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // consumer prefetch messages from the queue ensure they are ordered it means that only one ack at that time
        channel.prefetch(1)

        // send message to consumer
        channel.consume(queueName, message => {

            const msg = message.content.toString()

            setTimeout(() => {
                console.log(`processed ${msg}`)
                channel.ack(message)
            }, Math.random() * 1000);
        })
    } catch (error) {
        console.error(error)
    }
}

run().catch(err => console.log(err))