import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { removeAddress } from '@libs/itemManager';

import schema from './schema';

const deleteAddress: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const { addressId } = event.queryStringParameters;
  const valid = await schema.bodySchema(event.queryStringParameters);
  try {
    if (valid) {
      const result = await removeAddress(addressId);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    }
    throw 'please check your params';
  } catch (err) {
    return formatJSONResponse({
      result: String(err),
      statusCode: 400,
    });
  }
};

export const main = middyfy(deleteAddress);
