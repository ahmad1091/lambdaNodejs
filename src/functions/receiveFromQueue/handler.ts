import { middyfy } from '@libs/lambda';
import { receiveFromQue } from '@libs/itemManager';
import { formatJSONResponse } from '@libs/apiGateway';

const receiveOrder = async event => {
  try {
    const order = JSON.parse(event.Records[0].body);
    console.log(order);
    await receiveFromQue(order);
  } catch (error) {
    return formatJSONResponse({
      err: error,
      statusCode: 400,
    });
  }
};

export const main = middyfy(receiveOrder);
