import { sesParams } from './sesParams';
import { sesClient } from './sesClient';
import { itemTemplate } from './templateData';
export const sendEmail = async (order, receiver) => {
  const templateData = itemTemplate(order)[receiver];

  const params = sesParams(templateData, receiver, order.customer.email);

  const ses = sesClient();
  try {
  console.log('email para', params);
    const sendPromise = ses.sendTemplatedEmail(params).promise();
    const result = await sendPromise;
    console.log('result', result);
    return result;
  } catch (err) {
    throw Error(err);
  }
};
