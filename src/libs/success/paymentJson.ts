export const paymentJson = order => {
  return {
    intent: 'CAPTURE',
    application_context: {
      return_url: process.env.URL_SUCCESS_PAYPAL,
  //      'https://53vy01x4hb.execute-api.eu-west-1.amazonaws.com/success',
    },
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: String(order.totalAmount),
          breakdown: {
            currency_code: 'EUR',
            value: String(order.totalAmount),
            item_total: {
              currency_code: 'EUR',
              value: String(order.totalAmount),
            },
          },
        },
        items: [
          {
            name: 'Product Name',
            unit_amount: {
              currency_code: 'USD',
              value: String(order.totalAmount),
            },
            quantity: '1',
          },
        ],
      },
    ],
  };
};
