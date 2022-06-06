import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getItemsByName } from '@libs/itemManager';

import schema from './schema';

const itemsByName: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const valid = await schema.bodySchema(event.queryStringParameters);
  if (valid) {
    const { itemName } = event.queryStringParameters;
    const result = await getItemsByName(itemName);
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

export const main = middyfy(itemsByName);
