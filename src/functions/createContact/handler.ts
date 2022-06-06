import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { newContact } from '@libs/itemManager';

import schema from './schema';

const createContact: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const contact = event.body;

  const valid = await schema.bodySchema(event.body);
  if (valid) {
    try {
      const result = await newContact(contact);
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
      result: 'check your params',
      statusCode: 400,
    });
  }
};

export const main = middyfy(createContact);
