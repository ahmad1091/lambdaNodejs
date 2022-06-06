import * as AWS from 'aws-sdk';
// const sesClient = new SESClient({ region: REGION });
export const sesClient = () => {
  const SES_CONFIG = {
     region: process.env.REGION,
  };
  // AWS.config.update(SES_CONFIG);
  const ses = new AWS.SES(SES_CONFIG);
  return ses;
};
