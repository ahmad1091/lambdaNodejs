import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getByShopId } from '@libs/itemManager';

import schema from './schema';

const getCatByShopId: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const params = event.queryStringParameters;
  const valid = await schema.bodySchema(params);
  if (valid) {
    const result = await getByShopId(params);
    return formatJSONResponse({
      result,
      statusCode: 200,
    });
  } else {
    return formatJSONResponse({
      result: 'please check your params',
      statusCode: 400,
    });
  }
};

export const main = middyfy(getCatByShopId);
