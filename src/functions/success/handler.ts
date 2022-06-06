import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatHTMLResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { handleSuccess } from '@libs/success';
import schema from './schema';
//PayPal calls this endpoint with payment_id
const success: ValidatedEventAPIGatewayProxyEvent<
  typeof schema.typeSchema
> = async event => {
  const ids = event.queryStringParameters;
  const valid = await schema.bodySchema(ids);
  if (valid) {
    try {
      const response = await handleSuccess(ids);
      return formatHTMLResponse(`<h1>Loading...</h1>`);
    } catch (err) {
      return formatHTMLResponse(
        `<h1 style="background-color: red;>Error${JSON.stringify(err)}</h1>`,
      );
    }
  } else {
    return formatHTMLResponse(
      '<h1 style="background-color: red;>check your params</h1>',
    );
  }
};

export const main = middyfy(success);
