export const itemTemplate = order => {
  const items = order.positions;

  return {
    'halalo-confirm-order': {
      salutation: order.address.salutation || ' ',
      'first-name': order.address.firstName || ' ',
      name: order.address.lastName || ' ',
      'delivery-street': order.address.street || ' ',
      'delivery-street-no': order.address.houseNumber || ' ',
      'delivery-zip': order.address.zip || ' ',
      'delivery-city': order.address.city || ' ',
      'estimated-time': 45,
      'price-sum-items': parseFloat(order.sum_items).toFixed(2),
      'price-sum': parseFloat(order.invoice_sum).toFixed(2), //ORDERS.INVOICE.total_gross_amount
      'payment-type': order.payment_method || ' ', //PARAM.PAYMENT_METHOD.description
      'total-tax-amount': parseFloat(order.tax).toFixed(2), // ORDERS.INVOICE.total_tax_amount
      'delivery-fee': parseFloat(order.delfee).toFixed(2), // ORDERS.INVOICE_POSITION.grossamount
      'invoice-number': order.invoice_no, //ORDERS.INVOICE.invoice_number
      'invoice-date': order.inv_date || ' ', // ORDERS.INVOICE.invoice_date
      'shop-name': order.shop.shopName || ' ',
      'shop-street': order.shop.street || ' ',
      'shop-city': order.shop.city || ' ',
      items: items.map(e => {
        return {
          itemName: e.name, // ITEM_NAME.name
          quantity: e.quantity, //ORDERS.INVOICE_POSITION.quantity
          itemAmount: parseFloat(e.rawAmount).toFixed(2), //ORDERS.INVOICE_POSITION.gross_amount
          price: parseFloat(e.price).toFixed(2), //ORDERS.INVOICE_POSITION.gross_amount * ORDERS.INVOICE_POSITION.quantity.
        };
      }),
    },
    'halalo-delivery-boy': {
      salutation: order.address.salutation || ' ', //CUSTOMER.ADDRESS.SALUTATION
      'first-name': order.address.firstName || ' ', // CUSTOMER.ADDRESS.FIRST_NAME
      name: order.address.lastName || ' ', //CUSTOMER.ADDRESS.LAST_NAME
      'delivery-street': order.address.street || ' ', //CUSTOMER.ADDRESSS.STREET
      'delivery-street-no': order.address.houseNumber || ' ', //CUSTOMER.ADDRESSS.HOUSE_NUMBER
      'delivery-zip': order.address.zip || ' ', //CUSTOMER.ADDRESSS.ZIP
      'delivery-city': order.address.city || ' ', //CUSTOMER.ADDRESSS.CITY
      companyName: 'Halalo',
      'delivery-time': new Date(
        Date.now() +
          Number([order.deliveryOptions.match(/[+-]?\d+(\.\d+)?/g)][0]) * 60000,
      ).toLocaleTimeString('en-US', { timeZone: 'CET' }),
      'price-sum': parseFloat(order.invoice_sum).toFixed(2), //ORDERS.INVOICE.total_gross_amount
      'payment-type': order.payment_method || ' ', // PARAM.PAYMENT_METHOD.description
      'shop-name': order.shop.shopName || ' ',
      'shop-street': order.shop.street || ' ',
      'shop-city': order.shop.city || ' ',
      'link-in-progress': `https://53vy01x4hb.execute-api.eu-west-1.amazonaws.com/test/updateOrderStatus?status=3&orderId=${order.orderId}`,
      'link-delivered': `https://53vy01x4hb.execute-api.eu-west-1.amazonaws.com/test/updateOrderStatus?status=4&orderId=${order.orderId}`,
      items: items.map(e => {
        return {
          itemName: e.name || ' ', // ITEM_NAME.name
          quantity: e.quantity, //ORDERS.INVOICE_POSITION.quantity
          itemAmount: parseFloat(e.rawAmount).toFixed(2), //ORDERS.INVOICE_POSITION.gross_amount
          price: parseFloat(e.price).toFixed(2), //ORDERS.INVOICE_POSITION.gross_amount * ORDERS.INVOICE_POSITION.quantity.
          'item-image-link': e.imageUrl,
        };
      }),
    },
  };
};
