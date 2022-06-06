import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 150,
  events: [
    {
      sqs: {
        arn: process.env.SQS_NEWORDER,
        batchSize: 1,
      },
    },
  ],
};
