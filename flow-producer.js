const { FlowProducer } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({host: '127.0.0.1', port: 6379});

//1. Initalize  the FlowProducer
const flowProducer = new FlowProducer({connection});

async function createVideoPipeline() {
    
    //2.  Define the flow tree structure
    const flow = await flowProducer.add({
        
        // The Ultimate Parent
        queueName: 'notification-queue',
        name: 'notify-user',
        data: {userId: 'user_456'},

        //Children of notification-queue
        children: [
            {
                queueName: 'video-queue',
                name: 'transcode-video',
                data: {videoId: 'vid_111'},

                //Children of video-queue(Both run parallel)
                children: [
            {
                queueName: 'download-queue',
                name: 'download-raw-video',
                data: {url: 'https://example.com/video.mp4'}
            },
            {
                queueName: 'subtitle-queue',
                name: 'fetch-subtitles',
                data: { lang: 'en' },
            }
        ]
            }
        ]
    });

    console.log(`Flow successfully registered into Redis!`);
    process.exit(0);
}   

createVideoPipeline();
