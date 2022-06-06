import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { newAddress } from '@libs/itemManager';

import schema from './schema';

const createAddress: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const address = event.body;

  try {
    const valid = await schema.bodySchema(address);
    if (valid) {
      const result = await newAddress(address);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    }
    throw 'check your params';
  } catch (err) {
    return formatJSONResponse({
      err: String(err),
      statusCode: 400,
    });
  }
};

export const main = middyfy(createAddress);
