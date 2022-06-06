import { dbConnector } from '@libs/auroraDBConnector';
import { get_db_params } from '@libs/getDBParams';
import { map_db_response } from '@libs/map_db_response';
import { all, byLocationAndDesc } from '../queries';
import { columns } from '@libs/helpers';
const { gallery } = columns();

export const getAllGallery = async () => {
  const sql_statement = all();

  const orderConfig = get_db_params(sql_statement, null);
  const result = await dbConnector(orderConfig);
  const res = map_db_response(gallery, result);

  return res;
};

export const getByMeta = async (location, description) => {
  const sql_statement = byLocationAndDesc();
  const params = [
    { name: 'image_location', value: { stringValue: location } },
    { name: 'description', value: { stringValue: description } },
  ];
  const orderConfig = get_db_params(sql_statement, params);
  const result = await dbConnector(orderConfig);
  const res = map_db_response(['imageUrl'], result);

  return res[0];
};
