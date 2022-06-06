import paypal from '@paypal/checkout-server-sdk';
import { updatePaymentStatus } from '@libs/auroraDBPort';
import { getById } from '@functions/order';
// import { senEmail } from '../ses';
import { pushOrder } from '@libs/sqs';

export const captureOrder = async function (paymentJson, tokenId, client) {
  const request = new paypal.orders.OrdersCaptureRequest(tokenId);
  request.requestBody(paymentJson);
  try {
    const response = await client.execute(request);

    if (response.statusCode == 201) {
      const status = response.result.status;
      // const payment = paymentJson();
      //update payment status in the database;
      const orderId = await updatePaymentStatus(tokenId, status);
      console.log('orderId in successssssssss', orderId);

      const order = await getById(orderId);
      console.log('order in success', order);

      if (orderId && order?.orderId) {
        const sqsResponse = await pushOrder(order);
        console.log(sqsResponse);

        return response;
      }
      throw 'Some thing went wrong with this order';
      // you also need to add invoive using the id you getting from the sss
    } else {
      throw Error(response);
    }
  } catch (err) {
    console.log('err', err);

    throw Error(err);
  }
};
