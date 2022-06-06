export const itemTemplate = (params, orderId) => {
  try {
    const { items } = params.cartDetails;
    const { totalAmount } = params;
    const itemsString = items.reduce((acc, e) => {
      return (
        acc +
        `<img src="https://i.imgur.com/5Exd1Og.png">
      <span><b>Item name:</b> ${e.itemName}</span><br>
<span><b>Item quantity:</b> ${e.quantity}</span><br>
<span><b>Item price:</b> $${e.price}</span><hr><br>
<span><b>Item amount:</b> $${e.itemAmount}</span><hr><br>`
      );
    }, ``);

    return (
      `<h2>Invoice details </h2>` +
      itemsString +
      `<h3>Total amount: $${totalAmount}</h3>
    <h3>Address details</h3>
    <table>
    <tbody>
    <tr><td>first name: <span>${params.billingAddress.firstName}</span></td></tr>
    <tr><td>last name: <span>${params.billingAddress.lastName}</span></td></tr>
      <tr><td>Street: <span>${params.billingAddress.street}</span></td></tr>
      <tr><td>City: <span>${params.billingAddress.city}</span></td></tr>
    </tbody>
    </table>
    <a href="https://53vy01x4hb.execute-api.eu-west-1.amazonaws.com/test//updateOrderStatus?status=3&orderId=${orderId}">Confirm Pickup</a><br>
    <a href="https://53vy01x4hb.execute-api.eu-west-1.amazonaws.com/test//updateOrderStatus?status=4&orderId=${orderId}">Confirm Delivery</a>
    `
    );
  } catch (err) {
    throw err;
  }
};
