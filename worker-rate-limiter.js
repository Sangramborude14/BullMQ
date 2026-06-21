const { Worker } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({host: '127.0.0.1', port: 6379});

const worker = new Worker(
    'sms-queue',
    async (job) => {
        console.log(`[Worker] sending SMS message for job ${job.id}`);
    },
    {
        connection,

        limiter: {
            max: 10, // Maximum no of job processed
            duration: 1000, //per duration
        }
    }
)

console.log(`Worker started. Strictly limited to 10 jobs`)