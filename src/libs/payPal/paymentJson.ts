export const paymentJson = order => {
  return {
    intent: 'CAPTURE',
    application_context: {
      return_url:
        'https://53vy01x4hb.execute-api.eu-west-1.amazonaws.com/test/success', //??? Link here??
    },
    purchase_units: [
      {
        amount: {
          currency_code: 'USD', //EUR
          value: String(order.totalRawAmount), // totalOrderAmount
          breakdown: {
            currency_code: 'USD',
            value: String(order.totalRawAmount),
            item_total: {
              currency_code: 'USD',
              value: String(order.totalRawAmount),
            },
          },
        },
        items: [
          {
            name: 'Product Name',
            unit_amount: {
              currency_code: 'USD',
              value: String(order.totalRawAmount),
            },
            quantity: '1',
          },
        ],
      },
    ],
  };
};
