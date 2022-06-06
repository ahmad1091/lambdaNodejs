import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getItems } from '@libs/itemManager';

import schema from './schema';

const getAll: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const result = await getItems();
  return formatJSONResponse({
    result,
    statusCode: 200,
  });
};

export const main = middyfy(getAll);
