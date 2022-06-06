import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { customerAddressByUserName } from '@libs/itemManager';

import schema from './schema';

const customerAddressByUser: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const { userName } = event.queryStringParameters;
  const valid = await schema.bodySchema(event.queryStringParameters);
  if (valid) {
    try {
      const result = await customerAddressByUserName(userName);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    } catch (err) {
      return formatJSONResponse({
        err: String(err),
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

export const main = middyfy(customerAddressByUser);
