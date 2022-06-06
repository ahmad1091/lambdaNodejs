export const sqsParams = order => {
  return {
    DelaySeconds: 10,
    MessageAttributes: {
      Title: {
        DataType: 'String',
        StringValue: 'Order',
      },
      Author: {
        DataType: 'String',
        StringValue: 'Ahmad Altayeb',
      },
    },
    MessageBody: JSON.stringify(order),
    QueueUrl: process.env.QUEUEURL,
  };
};
