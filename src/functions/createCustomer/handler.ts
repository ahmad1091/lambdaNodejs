import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { newCustomer } from '@libs/itemManager';

import schema from './schema';

const createCustomer: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const { userName } = event.body;

  const valid = await schema.bodySchema(event.body);
  if (valid) {
    try {
      const result = await newCustomer(userName);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    } catch (err) {
      return formatJSONResponse({
        err,
        statusCode: 400,
      });
    }
  } else {
    return formatJSONResponse({
      result: 'check your params',
      statusCode: 400,
    });
  }
};

export const main = middyfy(createCustomer);
