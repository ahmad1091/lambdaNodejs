import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { customerById } from '@libs/itemManager';

import schema from './schema';

const customerData: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const { customerId } = event.queryStringParameters;
  const valid = await schema.bodySchema(event.queryStringParameters);
  if (valid) {
    const result = await customerById(customerId);
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

export const main = middyfy(customerData);
