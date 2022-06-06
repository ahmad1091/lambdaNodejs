export const get_db_params = (sqlStatement, sqlParameter) => {
  const db_params = {
    secretArn: process.env.DB_SECRETSTORE_ARN,
    resourceArn: process.env.DB_AURORACLUSTER_ARN,
    sql: sqlStatement,
    parameters: sqlParameter,
    includeResultMetadata: false,
    database: process.env.DB_NAME,
  };
  return db_params;
};
