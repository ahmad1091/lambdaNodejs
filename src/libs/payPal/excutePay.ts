import { paymentJson } from './paymentJson';
import paypal from '@paypal/checkout-server-sdk';
import { clientConfig } from './config';
import { createOrder } from './createOrder';

export const excutePay = async order => {
  const client = clientConfig();
  const paymant = paymentJson(order);
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody(paymant);

  return createOrder(request, client);
};
