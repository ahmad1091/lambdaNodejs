const status = {
  1: 'Pending',
  2: 'Waiting delivery',
  3: 'In progress',
  4: 'Completed',
  5: 'Cancel',
};

const paymentMethod = {
  1: 'PayPal',
};
const paymentStatus = {
  1: 'Requested',
  2: 'Completed',
};

const pushToObj = (obj, elem) => {
  const position = {
    orderPositionId: elem.orderPositionId,
    itemId: elem.itemId,
    quantity: elem.quantity,
    name: elem.itemName,
    price: elem.price ? elem.price : 0,
    priceTax: elem.priceTax ? elem.priceTax : 0,
    imageUrl: elem.itemImageUrl,
    category: elem.categoryName,
    description: elem.description,
    originCountry: elem.originCountry,
    weight: elem.weight,
    taxAmount: elem.priceTax * elem.quantity,
    rawAmount: elem.price * elem.quantity,
  };

  const customer = {
    customerId: elem.customerId,
    email: elem.email,
    phone: elem.phone,
  };
  const shop = {
    shopId: elem.shopId,
    shopName: elem.shopName,
    imageUrl: elem.imageUrl,
    street: elem.street,
    city: elem.city,
  };
  const payment = {
    paymentId: elem.paymentId,
    paymentStatus: paymentStatus[elem.paymentStatus],
    paymentMethod: paymentMethod[elem.paymentMethod],
  };
  const address = {
    addressId: elem.addressId,
    salutation: elem.salutation,
    firstName: elem.firstName,
    lastName: elem.lastName,
    street: elem.street,
    city: elem.city,
    zip: elem.zip,
    houseNumber: elem.houseNumber,
  };

  obj[elem.orderId] = {
    orderId: elem.orderId,
    creatingTime: elem.creatingTime,
    orderStatus: status[elem.orderStatus],
    deliveryOptions: elem.deliveryOptions,
    deliveryFee: elem.deliveryFee,
    invoiceNumber: elem.invoiceNumber,
    invoiceDate: elem.invoiceDate,
    totalRawAmount: obj[elem.orderId]?.totalRawAmount
      ? elem.price
        ? Number(obj[elem.orderId]?.totalRawAmount) + elem.quantity * elem.price
        : Number(obj[elem.orderId]?.totalRawAmount)
      : elem.price
      ? elem.quantity * elem.price
      : 0,
    totalTaxAmount: obj[elem.orderId]?.totalTaxAmount
      ? elem.priceTax
        ? Number(obj[elem.orderId]?.totalTaxAmount) +
          elem.quantity * elem.priceTax
        : Number(obj[elem.orderId]?.totalTaxAmount)
      : elem.priceTax
      ? elem.quantity * elem.priceTax
      : 0,
    shop,
    customer,
    payment,
    address,
    positions: obj[elem.orderId]?.positions
      ? obj[elem.orderId]?.positions.some(
          e => e.orderPositionId == elem.orderPositionId,
        )
        ? obj[elem.orderId].positions
        : [...obj[elem.orderId].positions, position]
      : [position],
    totalPositions: obj[elem.orderId]?.totalPositions
      ? obj[elem.orderId].totalPositions + elem.quantity
      : elem.quantity,
  };
};

export const formatOrderObj = async myArray => {
  const obj = {};
  await myArray.map(e => {
    pushToObj(obj, e);
  });
  const arr = Object.keys(obj).map(function (key) {
    return obj[key];
  });
  return arr;
};
