const { Queue } = require('bullmq');
const IORedis = require('ioredis');

//1. Establish connection to Redis
const connection = new IORedis({host: '127.0.0.1',port: 6379, maxRetriesPerRequest: null});

//2. Initialize the queue 
const myQueue = new Queue('email-queue', {connection});

async function addJob(){

    //3. Add a job
    const job = await myQueue.add('send-welcome-email', {
        userId: 'user_123',
        email: 'alex@example.com',
        template: 'welcome',
    });

    console.log(`Job added successfully`)
    process.exit(0);    
}

addJob();

async function addDelayJob(){

    //Define Delay in millisecond

    const TWO_HOURS = 2 * 60 * 60 * 1000;

    const job = await myQueue.add(
        'cart-abandonment-email',
        {
            userId: 'user_987',
            cartId: 'cart_abc',
            email: 'shopper@example.com',
        },
        {
            delay: TWO_HOURS,
        }
    );
    console.log(`Delayed job added! ID: ${job.id}`);
    process.exit(0);
}
addDelayJob();


// await job.remove() --> to delete a delayed job