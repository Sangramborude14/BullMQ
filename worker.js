const { Worker } = require('bullmq');
const IORedis = require('ioredis');

//1. Establish connection to Redis
const connection = new IORedis({host: '127.0.0.1',port: 6379, maxRetriesPerRequest: null});

//2. Initialize the worker
const worker = new Worker('email-queue', async (job) => {

//3. Define the processing logic inside this async function
console.log(`[Worker]  Processing job ${job.id} of type: ${job.name}`);
console.log(`[Worker] Sending email to ${job.data.email}...`);

// Simulating an async function operation
await new Promise((resolve) => setTimeout(resolve, 2000));

console.log(`[Worker] Job ${job.id} completed`)

//simulating api failure
throw new Error('Third party email API is down (503 service unavailable)')
},{connection,

    concurrency: 5 // This worker will now process up to 5 jobs at a time

});


worker.on('completed',(job,err) => {
    console.log(`Event: Job ${job.id} has completed successfully`);
})

worker.on('failed', (job,err) => {
    console.log(`Event: Job ${job.id} failed with error: ${err.message}`);
});

console.log(`Worker is running  and waiting for jobs...`)
