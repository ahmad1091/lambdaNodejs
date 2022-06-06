import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { sendMessage } from '@libs/itemManager';

const pushToQueue: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const order = event.body;

  const valid = await schema.bodySchema(order);
  if (valid) {
    try {
      const result = await sendMessage(order);
      return formatJSONResponse({
        result,
        statusCode: 200,
      });
    } catch (err) {
      return formatJSONResponse({
        err: err?.message,
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

export const main = middyfy(pushToQueue);
