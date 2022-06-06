import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getItemsPerId } from '@libs/itemManager';

import schema from './schema';

const getItemById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const valid = await schema.bodySchema(event.queryStringParameters);
  if (valid) {
    const { id } = event.queryStringParameters;
    const result = await getItemsPerId(id);
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

export const main = middyfy(getItemById);
