export const orders = () => {
  return `select
  o.order_id as orderId,
  o.timestamp_created as creatingTime,
  o.order_status_nr as orderStatus,
  o.delivery_options as deliveryOptions,
  c.customer_id as customerId,
  c.email,
  c.phone,
  a.first_name as firstName,
  a.last_name as lastName,
  a.address_id as addressId,
  a.street,
  a.city,
  a.zip,
  a.house_number as houseNumber,
  s.shop_nr as shopId,
  s.shop_name as shopName,
  s.imageUrl,
  s.street,
  s.city,
  si.price_raw as price,
  si.price_tax as priceTax,
  pay.payment_id as paymentId,
  pay.payment_status_nr as paymentStatus,
  pay.payment_method_nr as paymentMethod,
  p.order_position_id as orderPositionId,
  p.item_id as itemId,
  p.quantity,
  item.weight,
  nitem.name as itemName,
  item.imageUrl1 as itemImageUrl,
  category.category_name as categoryName,
  (select value from PARAM.GENERAL_ATTRIBUTES where name = 'DELIVERY_FEE')  as deliveryFee
  from ORDERS.ORDER o join ORDERS.ORDER_POSITION p join SHOP.SHOP s join CUSTOMER.ADDRESS a join CUSTOMER.CUSTOMER c join ORDERS.PAYMENT pay join ITEM.shop_item si join ITEM.ITEM item join ITEM.CATEGORY category join ITEM.ITEM_NAME nitem
  on o.order_id = p.order_id and o.shop_nr = s.shop_nr and  o.delivery_address_id = a.address_id and  o.payment_id = pay.payment_id and  o.customer_id = c.customer_id 
  and si.shop_nr = o.shop_nr and si.item_id = p.item_id and p.item_id = item.item_id and item.category_nr = category.category_nr and item.item_id = nitem.item_id
  ORDER BY o.timestamp_created DESC`;
};

export const getByUser = () => {
  return `select
  o.order_id as orderId,
  o.timestamp_created as creatingTime,
  o.order_status_nr as orderStatus,
  o.delivery_options as deliveryOptions,
  c.customer_id as customerId,
  c.email,
  c.phone,
  a.salutation as salutation,
  a.first_name as firstName,
  a.last_name as lastName,
  a.address_id as addressId,
  a.street,
  a.city,
  a.zip,
  a.house_number as houseNumber,
  s.shop_nr as shopId,
  s.shop_name as shopName,
  s.imageUrl,
  s.street,
  s.city,
  si.price_raw as price,
  si.price_tax as priceTax,
  pay.payment_id as paymentId,
  pay.payment_status_nr as paymentStatus,
  pay.payment_method_nr as paymentMethod,
  p.order_position_id as orderPositionId,
  p.item_id as itemId,
  p.quantity,
  item.weight,
  nitem.name as itemName,
  nitem.description,
  nitem.origin_country as originCountry,
  item.imageUrl1 as itemImageUrl,
  category.category_name as categoryName,
  (select value from PARAM.GENERAL_ATTRIBUTES where name = 'DELIVERY_FEE')  as deliveryFee
  from ORDERS.ORDER o join ORDERS.ORDER_POSITION p join SHOP.SHOP s join CUSTOMER.ADDRESS a join CUSTOMER.CUSTOMER c join ORDERS.PAYMENT pay join ITEM.shop_item si join ITEM.ITEM item join ITEM.CATEGORY category join ITEM.ITEM_NAME nitem
  on o.order_id = p.order_id and o.shop_nr = s.shop_nr and  o.delivery_address_id = a.address_id and  o.payment_id = pay.payment_id and  o.customer_id = c.customer_id 
and si.shop_nr = o.shop_nr and si.item_id = p.item_id and p.item_id = item.item_id and item.category_nr = category.category_nr and item.item_id = nitem.item_id 
where c.user_name =:user_name
  ORDER BY o.timestamp_created DESC`;
};

export const updateStatus = () => {
  return `UPDATE ORDERS.ORDER 
SET ORDERS.ORDER.order_status_nr = :order_status_nr
WHERE ORDERS.ORDER.order_id = :order_id;
  `;
};

export const getById = () => {
  return `select 
  o.order_id as orderId,
  o.timestamp_created as creatingTime,
  o.order_status_nr as orderStatus,
  o.delivery_options as deliveryOptions,
  c.customer_id as customerId,
  c.email,
  c.phone,
  a.salutation as salutation,
  a.first_name as firstName,
  a.last_name as lastName,
  a.address_id as addressId,
  a.street,
  a.city,
  a.zip,
  a.house_number as houseNumber,
  s.shop_nr as shopId,  
  s.shop_name as shopName,
  s.imageUrl,
  s.street,
  s.city,
  si.price_raw as price,
  si.price_tax as priceTax,
  pay.payment_id as paymentId,
  pay.payment_status_nr as paymentStatus,
  pay.payment_method_nr as paymentMethod,
  p.order_position_id as orderPositionId,
  p.item_id as itemId,
  p.quantity,
  item.weight,
  nitem.name as itemName,
  nitem.description,
  nitem.origin_country as originCountry,
  item.imageUrl1 as itemImageUrl,
  category.category_name as categoryName,
  (select value from PARAM.GENERAL_ATTRIBUTES where name = 'DELIVERY_FEE')  as deliveryFee
  from ORDERS.ORDER o join ORDERS.ORDER_POSITION p join SHOP.SHOP s join CUSTOMER.ADDRESS a join CUSTOMER.CUSTOMER c join ORDERS.PAYMENT pay join ITEM.shop_item si join ITEM.ITEM item join ITEM.CATEGORY category join ITEM.ITEM_NAME nitem
  on o.order_id = p.order_id and o.shop_nr = s.shop_nr and  o.delivery_address_id = a.address_id and  o.payment_id = pay.payment_id and  o.customer_id = c.customer_id 
and si.shop_nr = o.shop_nr and si.item_id = p.item_id and p.item_id = item.item_id and item.category_nr = category.category_nr and item.item_id = nitem.item_id 
WHERE o.order_id = :order_id
  ORDER BY o.timestamp_created DESC
  `;
};

export const getInvoiceDataByOrderId = () => {
  return `select 
  invoice_number as invoiceNumber,
  invoice_date as invoiceDate 
  from ORDERS.INVOICE where order_id = :order_id;`;
};
