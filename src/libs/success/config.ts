import paypal from '@paypal/checkout-server-sdk';

export const clientConfig = () => {
  const PAYPAL_CLIENTID = process.env.PAYPAL_CLIENTID;
  const PAYPAL_CLIENTSECRET = process.env.PAYPAL_CLIENTSECRET;

  const environment = new paypal.core.SandboxEnvironment(
    PAYPAL_CLIENTID,
    PAYPAL_CLIENTSECRET,
  );
  const client = new paypal.core.PayPalHttpClient(environment);
  return client;
};
