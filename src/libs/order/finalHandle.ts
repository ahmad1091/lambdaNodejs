import { invoicing } from '@libs/auroraDBPort';
import { getDataForEmail } from '@libs/auroraDBPort';
import { sendEmail } from '../ses';
import { getInvoiceById } from '@functions/order';

export const finalHandle = async order => {

  try {
    const invoiceId = await invoicing(order);
    console.log('invoicing finished', invoiceId);

   const result_dataForEmail = await getDataForEmail(invoiceId);
   const invoicedOrder = { ...order, ...result_dataForEmail};
 //   e-mail for customer
    await sendEmail(invoicedOrder, 'halalo-confirm-order');
//e-mail for delivery boy
    await sendEmail(invoicedOrder, 'halalo-delivery-boy');

    console.log('E Mail was sent');
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};
