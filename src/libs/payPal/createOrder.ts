export const createOrder = async function (request, client) {
  try {
    const response = await client.execute(request);
    return {
      paypalLink: response.result.links[1].href,
      paymentId: response.result.id,
    };
  } catch (err) {
    throw JSON.stringify(err);
  }
};
