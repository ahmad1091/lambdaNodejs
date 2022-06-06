import { calculatePrices } from './calculatePrices';
// import { pushOrder } from '@libs/sqs';
import { insertOrderDetails, invoicing } from '@libs/auroraDBPort';
import { excutePay } from '@libs/payPal';
import { preSQSInsertion } from '@libs/auroraDBPort';

export const initialHandle = async order => {
  try {
    order.totalRawAmount = 0;
    order.totalTaxAmount = 0;
    const updatedOrder = await calculatePrices(order);
    const deliveryAddressId = await preSQSInsertion(order);
    const { paypalLink, paymentId } = await excutePay(order);
    const newOrder = {
      updatedOrder,
      paymentId,
      deliveryAddressId,
    };
    const { orderId } = await insertOrderDetails(newOrder);

    console.log('result for insertion......', newOrder, orderId);
    return { updatedOrder, paypalLink, orderId };
  } catch (err) {
    throw err;
  }
};
