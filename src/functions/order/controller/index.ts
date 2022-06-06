import {
  ordersByUser,
  getByUserId,
  changeStatus,
  getInvoiceByUserId,
} from '../model';

export const getByUserName = async params => {
  const data = await ordersByUser(params);
  return data;
};
export const updateStatus = async params => {
  const data = await changeStatus(params);
  return data;
};
export const getById = async orderId => {
  const data = await getByUserId(orderId);
  return data[0];
};

export const getInvoiceById = async orderId => {
  const data = await getInvoiceByUserId(orderId);
  return data[0];
};
