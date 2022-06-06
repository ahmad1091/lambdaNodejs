import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { getItemsPerId, getAllShopInformation } from '@libs/itemManager';
import { calculatePrices } from '@libs/order/calculatePrices';

import schema from './schema';

interface IObject {
  [key: string]: any;
}

const validateOrder: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  try {
    const order: IObject = event.body;
    const shop = await getAllShopInformation(order.cartDetails.shopId);

    if (shop.length > 0) {
      const itemsPerId = order?.cartDetails?.items.map(async item => {
        const i = await getItemsPerId(item.itemId);
        if (i[0] == undefined) {
          throw new Error(
            `Item with id ${item.itemId} is not found or not assigned to shop`,
          );
        }
        return i[0];
      });
      const items = await Promise.all(itemsPerId);

      const res = order.cartDetails.items.reduce((acc, item) => {
        const itemInShop: IObject = items?.find(
          shopItem => shopItem.itemId == item.itemId,
        );

        return (
          acc &&
          item.quantity >= itemInShop.minOrderQty &&
          item.quantity <= itemInShop.maxOrderQty &&
          item.quantity >= Number.parseInt(shop[0].minimum_order_value)
        );
      }, true);

      if (res) {
        order.totalOrderAmount = 0;
        order.totalRawAmount = 0;
        order.totalTaxAmount = 0;

        const orederWithPrices = await calculatePrices(order);
        return formatJSONResponse({
          statusCode: 200,
          result: [
            {
              ...orederWithPrices,
            },
          ],
        });
      } else {
        throw new Error(
          'Order is not valid quantity is less or more than allowed',
        );
      }
    } else {
      throw new Error(`Shop with id ${order.cartDetails.shopId} not found`);
    }
  } catch (err) {
    return formatJSONResponse({
      error: String(err),
      statusCode: 400,
    });
  }
};

export const main = middyfy(validateOrder);
