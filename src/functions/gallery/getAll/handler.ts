import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getAll } from '../controller';

import schema from './schema';

const getAllGallery: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async () => {
    const result = await getAll();
    return formatJSONResponse({
      result,
      statusCode: 200,
    });
  };

export const main = middyfy(getAllGallery);
