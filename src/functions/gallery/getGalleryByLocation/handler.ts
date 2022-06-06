import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getByName } from '../controller';

import schema from './schema';

const getImageByName: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  try {
    const params = event.queryStringParameters;
    const valid = await schema.bodySchema(params);
    if (valid) {
      const result = await getByName(params);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    }
    throw 'check your params';
  } catch (err) {
    return formatJSONResponse({
      error: String(err),
      statusCode: 400,
    });
  }
};

export const main = middyfy(getImageByName);
