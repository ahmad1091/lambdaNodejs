import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { ShopById } from '@libs/itemManager';
import schema from './schema';

const getShopByShopID: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  try {
    const { shopId } = event.pathParameters;

    if (!shopId) {
      throw { message: 'There is no shopeId' };
    }
    const result = await ShopById(shopId);

    if (result?.length > 0) {
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    } else {
      return formatJSONResponse({
        result: {
          message: 'There is no shop with this id',
        },
        statusCode: 404,
      });
    }
  } catch (err) {
    return formatJSONResponse({
      error: String(err),
      statusCode: 400,
    });
  }
};

export const main = middyfy(getShopByShopID);
