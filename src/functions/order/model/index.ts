import { dbConnector } from '@libs/auroraDBConnector';
import { get_db_params } from '@libs/getDBParams';
import { map_db_response } from '@libs/map_db_response';
import {
  getByUser,
  orders,
  updateStatus,
  getById,
  getInvoiceDataByOrderId,
} from '../queries';
import { columns, isEmail, isNull } from '@libs/helpers';
import { formatOrderObj } from '../helpers';
const { orderCols } = columns();

export const getAllOrders = async () => {
  const sql_statement = orders();

  const orderConfig = get_db_params(sql_statement, null);
  const result = await dbConnector(orderConfig);
  const res = map_db_response(orderCols, result);

  return formatOrderObj(res);
};

export const ordersByUser = async data => {
  const { userName } = data;
  if (!isNull(userName)) {
    const key = isEmail(userName) ? 'email' : 'phone';
    const value = key == 'phone' ? '+'.concat(userName.slice(1)) : userName;
    const sql_statement = getByUser();
    const params = [{ name: 'user_name', value: { stringValue: value } }];
    const orderConfig = get_db_params(sql_statement, params);
    const result = await dbConnector(orderConfig);
    const res = map_db_response(orderCols, result);

    return formatOrderObj(res);
  } else {
    return getAllOrders();
  }
};

export const changeStatus = async data => {
  const sql_statement = updateStatus();
  const params = [
    { name: 'order_status_nr', value: { longValue: data.status } },
    { name: 'order_id', value: { stringValue: data.orderId } },
  ];
  const orderConfig = get_db_params(sql_statement, params);
  const result = await dbConnector(orderConfig);

  return result;
};

export const getByUserId = async orderId => {
  const sql_statement = getById();
  const params = [{ name: 'order_id', value: { stringValue: orderId } }];
  const orderConfig = get_db_params(sql_statement, params);
  const result = await dbConnector(orderConfig);

  const res = map_db_response(orderCols, result);

  return formatOrderObj(res);
};

export const getInvoiceByUserId = async orderId => {
  const sql_statement = getInvoiceDataByOrderId();
  const params = [{ name: 'order_id', value: { stringValue: orderId } }];
  const orderConfig = get_db_params(sql_statement, params);
  const result = await dbConnector(orderConfig);

  const res = map_db_response(['invoiceNumber', 'invoiceDate'], result);
  console.log(res);

  return res;
};
