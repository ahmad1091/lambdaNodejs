import * as AWS from 'aws-sdk';
import { sqsParams } from './sqsParams';

export const pushOrder = async order => {
  AWS.config.update({ region: process.env.REGION });
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
  const params = sqsParams(order);
  const promis = new Promise((resolve, reject) => {
    sqs.sendMessage(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(`Success`);
      }
    });
  });
  try {
    const result = await promis;
    return result;
  } catch (err) {
    throw Error(err);
  }
};
