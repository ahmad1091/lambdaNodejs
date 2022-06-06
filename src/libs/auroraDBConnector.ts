const AWS = require('aws-sdk');

const RDS = new AWS.RDSDataService();
export const dbConnector = async params => {
  try {
    const result = await RDS.executeStatement(params).promise();
    return result;
  } catch (err) {
    throw err;
  }
};
