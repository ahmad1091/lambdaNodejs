import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getShopsPerLocation } from '@libs/itemManager';

import schema from './schema';

const shopsByLocation: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const Location = event.queryStringParameters;
  const valid = await schema.bodySchema(Location);
  if (valid) {
    try {
      const result = await getShopsPerLocation(Location);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    } catch (err) {
      return formatJSONResponse({
        result: err,
        statusCode: 400,
      });
    }
  } else {
    return formatJSONResponse({
      result: 'please check your params',
      statusCode: 400,
    });
  }
};

export const main = middyfy(shopsByLocation);
