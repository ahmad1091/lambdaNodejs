//This function maps the result of RDS.executeStatement to an array
export const map_db_response = (cols, db_result) => {
  //cols are the expected colums
  //db_result ist the raw result from the DB
  //returns an array of the result
  const rows = [];
  // let i;
  // build an array of rows: { key=>value }
  if (db_result.records == undefined) {
    return [];
  }
  db_result.records.map(r => {
    const row = {};
    r.map((v, i) => {
      if (v.doubleValue) {
        row[cols[i]] = v.doubleValue;
      } else if (v.stringValue) {
        row[cols[i]] = v.stringValue;
      } else if (v.blobValue) {
        row[cols[i]] = v.blobValue;
      } else if (v.longValue || v.longValue == 0) {
        row[cols[i]] = v.longValue;
      } else if (v.booleanValue) {
        row[cols[i]] = v.booleanValue;
      } else if (v.isNull) {
        row[cols[i]] = null;
      }
    });
    rows.push(row);
  });

  return rows;
};
