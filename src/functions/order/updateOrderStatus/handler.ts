import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatHTMLResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { updateStatus } from '../controller';

import schema from './schema';

const updateOrderStatus: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const params = event.queryStringParameters;
  const valid = await schema.bodySchema(params);
  try {
    if (valid) {
      const result = await updateStatus(params);
      return formatHTMLResponse(`<h1>Successfully updates</h1>`);
    }
    throw 'check your params';
  } catch (err) {
    return formatHTMLResponse(
      `<h1>Some thing went wrong pleas contact support</h1>`,
    );
  }
};

export const main = middyfy(updateOrderStatus);
