import { getItemsPricesByIds } from '@libs/auroraDBPort';

export const calculatePrices = async order => {
  const itemsArray = order.cartDetails.items;
  const idsArr = itemsArray.map(e => {
    return e.itemId;
  });

  const pricedObj = await getItemsPricesByIds(idsArr, order.cartDetails.shopId);
  if (Object.keys(pricedObj).length > 0) {
    itemsArray.map(e => {
      order.totalRawAmount += e.quantity * pricedObj[e.itemId].price;
      order.totalTaxAmount += e.quantity * pricedObj[e.itemId].priceTax;
      order.deliveryFee = pricedObj[e.itemId].deliveryFee;
      e.rawAmount = e.quantity * pricedObj[e.itemId].price;
      e.taxAmount = e.quantity * pricedObj[e.itemId].priceTax;
      e.itemName = pricedObj[e.itemId].name;
      e.priceTax = pricedObj[e.itemId].priceTax;
      e.taxRate = pricedObj[e.itemId].taxRate;
      e.price = pricedObj[e.itemId].price;
    });

    order.totalOrderAmount = order.totalRawAmount + order.deliveryFee;
    order.totalOrderAmount = Math.round(order.totalOrderAmount * 100) / 100;

    return order;
  }
  return [];
};
