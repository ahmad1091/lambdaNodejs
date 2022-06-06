import { v4 as uuid } from 'uuid';
import { dbConnector } from '@libs/auroraDBConnector';
import { get_db_params } from '@libs/getDBParams';
import { map_db_response } from '@libs/map_db_response';
import { columns, isEmail } from '@libs/helpers';
const DEFAULT_PAYMENT_METHOD = 1;
const DEFAULT_PAYMENT_STATUS = 1;
const {
  itemCols,
  catCols,
  shopCols,
  addressCols,
  orderCols,
  customerCols,
  shopInfo,
  invDataCols,
} = columns();

export const getShopsQ = async () => {
  const currentDay = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][new Date().getDay()];
  const currentHour = String(new Date().getHours());

  const sqlStatement_all = `select 
    shop.shop_nr as shopNr,
    shop.shop_name as shopName,
    shop.street,
    shop.street_number as streetNumber,
    shop.zip,
    shop.city,
    shop.latitude,
    shop.longitude,
    shop.minimum_order_value as minimumOrderValue,
    shop.imageUrl,
    shop.delivery_radius as deliveryRadius,
    sitem.Category_nr as categoryId,
    (select gen.value from PARAM.GENERAL_ATTRIBUTES gen where name = 'DELIVERY_FEE' ) as deliveryFee,
    (select holiday_day from SHOP.closed_days where shop_nr = shop.shop_nr) as holidays,
    (SELECT COUNT(*) FROM  SHOP.working_hours  WHERE shop_nr = shop.shop_nr AND ${currentHour} BETWEEN opening_hour AND closing_hour AND working_day like  '%${currentDay}%' ) as isOpen
    from SHOP.SHOP shop join ITEM.shop_item sitem 
    on shop.shop_nr = sitem.shop_nr 
    where shop.unpublish = false;
    `;

  const sqlParameter_all = [];

  const params_Shops = get_db_params(sqlStatement_all, sqlParameter_all);

  const result_allShopes = await dbConnector(params_Shops);

  return map_db_response(shopCols, result_allShopes);
};

export const getAllShopInfo = async shopId => {
  const sqlStatement_allInfo = ` 
  SELECT 
  SHOP.SHOP.*,
  SHOP.closed_days.holiday_day AS hloidays,
  SHOP.working_hours.working_day AS workingDays,
  SHOP.working_hours.closing_hour AS closingHour,
  SHOP.working_hours.opening_hour AS openingHour
  FROM SHOP.SHOP JOIN SHOP.closed_days 
  ON SHOP.SHOP.shop_nr = SHOP.closed_days.shop_nr 
  JOIN SHOP.working_hours ON SHOP.SHOP.shop_nr = SHOP.working_hours.shop_nr
  WHERE SHOP.SHOP.shop_nr=:shop_nr
  `;
  const sqlParameter_allInfo = [
    { name: 'shop_nr', value: { stringValue: shopId } },
  ];
  const params_Shops = get_db_params(
    sqlStatement_allInfo,
    sqlParameter_allInfo,
  );

  const result_allShopes = await dbConnector(params_Shops);
  return map_db_response(shopInfo, result_allShopes);
};

export const getShopsById = async id => {
  const sqlStatement_shopById =
    'select * from SHOP.SHOP where SHOP.SHOP.shop_nr= :shop_nr;';
  const sqlParameter_shopById = [
    { name: 'shop_nr', value: { stringValue: id } },
  ];

  const params_Shops = get_db_params(
    sqlStatement_shopById,
    sqlParameter_shopById,
  );

  const result_allShopes = await dbConnector(params_Shops);
  return map_db_response(shopCols, result_allShopes);
};

export const getItemsQ = async () => {
  const sqlStatement_all = 'select * from ITEM.ITEM;'; // must retrive the details with the item
  const sqlParameter_all = [];

  const params_Items = get_db_params(sqlStatement_all, sqlParameter_all);

  const result_allItemes = await dbConnector(params_Items);
  return map_db_response(itemCols, result_allItemes);
};

export const getById = async id => {
  const sqlStatement_ItemsByCategory = `
  SELECT 
  ite.item_id as itemId,
  ite.category_nr as categoryId,
  ite.is_halal_certified as halalCertified,
  ite.sales_unit_nr as salesUnit,
  ite.maximum_order_quantity as maxOrderQty,
  ite.minimum_order_quantity as minOrderQty,
  ite.nonfood as nonFood,
  ite.freshfood as freshFood,
  ite.cooling_requiered_nr coolingRequieredNum,
  ite.brand,
  ite.weight,
  ite.volume_size_nr volumeSize,
  ite.imageUrl1 as imgUrl1,
  ite.imageUrl2 as imgUrl2,
  nitem.language_nr as languageNr,
  nitem.name as name,
  nitem.description as description,
  nitem.origin_country as originCountry,
  nitem.item_name_id as itemNameId,
  sitem.shop_item_id as shopItemId,
  sitem.shop_nr as shopId,
  (select shop.shop_name from SHOP.SHOP shop where sitem.shop_nr = shop.shop_nr) as shopName,
  sitem.price_raw as priceRaw,
  sitem.price_tax as priceTax,
  sitem.tax_rate as taxRate 
  FROM ITEM.ITEM ite join ITEM.shop_item sitem join ITEM.ITEM_NAME nitem on ite.item_id = sitem.item_id and ite.item_id = nitem.item_id 
  where ite.item_id = :item_id 
  group by ite.item_id;`;

  const sqlParameter_ItemsByCategory = [
    { name: 'item_id', value: { stringValue: id } },
  ];

  const params_Items = get_db_params(
    sqlStatement_ItemsByCategory,
    sqlParameter_ItemsByCategory,
  );

  const result_itemsperid = await dbConnector(params_Items);
  return map_db_response(itemCols, result_itemsperid);
};

export const getByCategory = async category => {
  const sqlStatement_ItemsByCategory = `SELECT 
    ite.item_id as itemId,
    ite.category_nr as categoryId,
    ite.is_halal_certified as halalCertified,
    ite.sales_unit_nr as salesUnit,
    ite.maximum_order_quantity as maxOrderQty,
    ite.minimum_order_quantity as minOrderQty,
    ite.nonfood as nonFood,
    ite.freshfood as freshFood,
    ite.cooling_requiered_nr coolingRequieredNum,
    ite.brand,
    ite.weight,
    ite.volume_size_nr volumeSize,
    ite.imageUrl1 as imgUrl1,
    ite.imageUrl2 as imgUrl2,
    nitem.item_name_id as itemNameId,
    nitem.language_nr as languageNr,
    nitem.name as name,
    nitem.description as itemDescription,
    nitem.origin_country as originCountry,
    sitem.shop_item_id as shopItemId,
    sitem.shop_nr as shopId,
    (select shop.shop_name from SHOP.SHOP shop where sitem.shop_nr = shop.shop_nr) as shopName,
    sitem.price_raw as priceRaw,
    sitem.price_tax as priceTax,
    sitem.tax_rate as taxRate 
    FROM ITEM.ITEM ite join ITEM.shop_item sitem join ITEM.ITEM_NAME nitem on ite.item_id = sitem.item_id and nitem.item_name_id = nitem.item_name_id
    WHERE ite.category_nr= :category_nr
    group by ite.category_nr;`;
  const sqlParameter_ItemsByCategory = [
    { name: 'category_nr', value: { longValue: category } },
  ];

  const params_Items = get_db_params(
    sqlStatement_ItemsByCategory,
    sqlParameter_ItemsByCategory,
  );

  const result_itemspercategory = await dbConnector(params_Items);
  return map_db_response(itemCols, result_itemspercategory);
};

export const filterItems = async params => {
  const { shopId, categoryId } = params;

  const sqlStatement_filteredItems = `SELECT 
    ite.item_id as itemId,
    ite.category_nr as categoryId,
    ite.is_halal_certified as halalCertified,
    ite.sales_unit_nr as salesUnit,
    ite.maximum_order_quantity as maxOrderQty,
    ite.minimum_order_quantity as minOrderQty,
    ite.nonfood as nonFood,
    ite.freshfood as freshFood,
    ite.cooling_requiered_nr coolingRequieredNum,
    ite.brand,
    ite.weight,
    ite.volume_size_nr volumeSize,
    ite.imageUrl1 as imgUrl1,
    ite.imageUrl2 as imgUrl2,
    nitem.language_nr as languageNr,
    nitem.name as name,
    nitem.description as description,
    nitem.origin_country as originCountry,
    nitem.item_name_id as itemNameId,
    sitem.shop_item_id as shopItemId,
    sitem.shop_nr as shopId,
    (select shop.shop_name from SHOP.SHOP shop where sitem.shop_nr = shop.shop_nr) as shopName,
    sitem.price_raw as priceRaw,
    sitem.price_tax as priceTax,
    sitem.tax_rate as taxRate 
    FROM ITEM.ITEM ite join ITEM.shop_item sitem join ITEM.ITEM_NAME nitem on ite.item_id = sitem.item_id and sitem.item_id = nitem.item_id
    WHERE sitem.shop_nr=:shop_nr and sitem.Category_nr=:category_nr;`;
  const sqlParameter_filteredItems = [
    { name: 'shop_nr', value: { stringValue: shopId } },
    { name: 'category_nr', value: { longValue: categoryId } },
  ];

  const params_Items = get_db_params(
    sqlStatement_filteredItems,
    sqlParameter_filteredItems,
  );

  const result = await dbConnector(params_Items);
  return map_db_response(itemCols, result);
};

export const categorizedItems = async params => {
  const { shopId, categoryId } = params;

  const sqlStatement_filteredItems = '//'; // make more sence >>where shop_nr = shop_nr=:shop_nr &Category_nr=:category_n;
  const sqlParameter_filteredItems = [
    { name: 'shop_nr', value: { stringValue: shopId } },
    { name: 'category_nr', value: { stringValue: categoryId } },
  ];

  const params_Items = get_db_params(
    sqlStatement_filteredItems,
    sqlParameter_filteredItems,
  );

  const result = await dbConnector(params_Items);
  return map_db_response(itemCols, result);
};

export const catByShopId = async shopId => {
  const sqlStatement =
    'SELECT ITEM.CATEGORY.category_nr as categoryId, ITEM.CATEGORY.category_name as title,  ITEM.CATEGORY.language_nr as languageId, ITEM.CATEGORY.imageUrl FROM ITEM.CATEGORY join ITEM.shop_item on ITEM.CATEGORY.category_nr = ITEM.shop_item.Category_nr where shop_nr =:shop_nr group by categoryId ;';
  const sqlParameter = [{ name: 'shop_nr', value: { stringValue: shopId } }];
  const paramsCats = get_db_params(sqlStatement, sqlParameter);

  const resultCats = await dbConnector(paramsCats);
  return map_db_response(catCols, resultCats);
};
export const userExists = async user => {
  //check if the customer user is already exist??
  // const key = Object.keys(user)[0];
  const value = Object.values(user)[0];
  const sqlStatement = `SELECT EXISTS (SELECT * from CUSTOMER.CUSTOMER cus WHERE cus.user_name=:user_name);`;
  const sqlParameter = [{ name: 'user_name', value: { stringValue: value } }];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return result.records[0][0].longValue;
};
export const insertCustomer = async user => {
  const isUser = await userExists(user);
  if (!isUser) {
    // const key = Object.keys(user)[0];
    const value = Object.values(user)[0];
    const customerId = uuid();
    const sqlStatement_createNew = `insert into CUSTOMER.CUSTOMER (customer_id, user_name) values (:customer_id, :user_name) ;`;
    const sqlParameter_createNew = [
      { name: 'customer_id', value: { stringValue: customerId } },
      { name: 'user_name', value: { stringValue: value } },
    ];
    const params_customer = get_db_params(
      sqlStatement_createNew,
      sqlParameter_createNew,
    );
    const result_create = await dbConnector(params_customer);
    return result_create;
  } else {
    throw 'this user is already exist';
  }
};

export const getByItemName = async itemName => {
  const sqlStatement = `SELECT 
    ite.item_id as itemId,
    ite.category_nr as categoryId,
    ite.is_halal_certified as halalCertified,
    ite.sales_unit_nr as salesUnit,
    ite.maximum_order_quantity as maxOrderQty,
    ite.minimum_order_quantity as minOrderQty,
    ite.nonfood as nonFood,
    ite.freshfood as freshFood,
    ite.cooling_requiered_nr coolingRequieredNum,
    ite.brand,
    ite.weight,
    ite.volume_size_nr volumeSize,
    ite.imageUrl1 as imgUrl1,
    ite.imageUrl2 as imgUrl2,
    nitem.language_nr as languageNr,
    nitem.name as name,
    nitem.description as description,
    nitem.origin_country as originCountry,
    nitem.item_name_id as itemNameId,
    sitem.shop_item_id as shopItemId,
    sitem.shop_nr as shopId,
    (select shop.shop_name from SHOP.SHOP shop where sitem.shop_nr = shop.shop_nr) as shopName,
    sitem.price_raw as priceRaw,
    sitem.price_tax as priceTax,
    sitem.tax_rate as taxRate 
    FROM ITEM.ITEM ite join ITEM.shop_item sitem join ITEM.ITEM_NAME nitem on ite.item_id = sitem.item_id and sitem.item_id = nitem.item_id
    WHERE nitem.name like '%' :name '%'`;
  const sqlParameter = [
    { name: 'name', value: { stringValue: itemName.trim() } },
  ];
  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return map_db_response(itemCols, result);
};

export const getItemsPricesByIds = async (idsArr, shopNr) => {
  let idsString = '';
  const sqlParameter = idsArr.map((e, index) => {
    idsString += `:id_${index + 1},`;
    return { name: `id_${index + 1}`, value: { stringValue: e } };
  });
  const sqlStatement = `SELECT item.item_id as itemId ,item.price_raw as price , item.price_tax as priceTax, item.tax_rate as taxRate,
  (select name from ITEM.ITEM_NAME nitem where nitem.item_id = item.item_id) as name ,
  (SELECT value FROM PARAM.GENERAL_ATTRIBUTES WHERE name = 'DELIVERY_FEE' ) as deliveryFee
  FROM ITEM.shop_item item 
WHERE item.item_id IN (${idsString.slice(0, -1)}) and shop_nr = :shop_nr
group by item.item_id;`;
  sqlParameter.push({ name: 'shop_nr', value: { stringValue: shopNr } });

  const params = get_db_params(sqlStatement, sqlParameter);
  const result = await dbConnector(params);
  const pricedObj = {};

  const items = map_db_response(
    ['itemId', 'price', 'priceTax', 'taxRate', 'name', 'deliveryFee'],
    result,
  );

  await items.map(e => {
    pricedObj[e.itemId] = {
      price: e.price,
      name: e.name,
      priceTax: e.priceTax,
      taxRate: e.taxRate,
      deliveryFee: e.deliveryFee,
    };
  });

  return pricedObj;
};

export const getCustomerIdByUserName = async userName => {
  console.log('useer', userName);

  const key = isEmail(userName) ? 'email' : 'phone';
  const value = key == 'phone' ? '+'.concat(userName.slice(1)) : userName;

  const sqlStatment = `select customer.customer_id as customerId  from CUSTOMER.CUSTOMER customer where user_name=:user_name`;
  const sqlParams = [{ name: 'user_name', value: { stringValue: value } }];
  const params = get_db_params(sqlStatment, sqlParams);

  const result = await dbConnector(params);

  return map_db_response(['customerId'], result)[0]?.customerId;
};

export const insertOrderDetails = async data => {
  const orderId = uuid();
  const order = data.updatedOrder;
  const itemArr = order.cartDetails.items;
  const customerId = await getCustomerIdByUserName(order.userName);
  //create Payment//////////////////////////////////////////////////////////////////////////////////////
  const payment_SqlStatment = `insert into ORDERS.PAYMENT (payment_id,payment_method_nr,payment_status_nr, transaction_id)
  values(:payment_id, :payment_method_nr, :payment_status_nr, :transaction_id);`;
  const paymentId = uuid();

  const payment_params = [
    { name: 'payment_id', value: { stringValue: paymentId } },
    {
      name: 'payment_method_nr',
      value: { longValue: DEFAULT_PAYMENT_METHOD }, //for paypal 1
    },
    {
      name: 'payment_status_nr',
      value: { longValue: DEFAULT_PAYMENT_STATUS },
    }, //FOR PENDING 1,FOR COMPLETED 2
    {
      name: 'transaction_id',
      value: { stringValue: data.paymentId },
    },
  ];
  const params_payment = get_db_params(payment_SqlStatment, payment_params);

  const result_payment = await dbConnector(params_payment);
  console.log('result_payment', result_payment);
  //create Order/////////////////////////////////////////////////////////////////////////////////////////
  const order_SqlStatment = `insert into ORDERS.ORDER 
  (order_id, customer_id, shop_nr, payment_id, order_status_nr, delivery_options, delivery_address_id)
  values(:order_id, :customer_id, :shop_nr, :payment_id, :order_status_nr, :delivery_options, :delivery_address_id);`;

  const order_params = [
    { name: 'order_id', value: { stringValue: orderId } },
    { name: 'customer_id', value: { stringValue: customerId } },
    { name: 'shop_nr', value: { stringValue: order.cartDetails.shopId } },
    { name: 'payment_id', value: { stringValue: paymentId } },
    { name: 'order_status_nr', value: { longValue: 1 } }, // for placement 1
    {
      name: 'delivery_options',
      value: { stringValue: order.deliveryOptions },
    },
    {
      name: 'delivery_address_id',
      value: { stringValue: data.deliveryAddressId },
    },
  ];
  const params_order = get_db_params(order_SqlStatment, order_params);

  const result_order = await dbConnector(params_order);

  console.log('result_order', result_order);

  itemArr.map(async e => {
    const orderPositionId = uuid();
    const orderPosition_SqlStatment = `insert into ORDERS.ORDER_POSITION (order_position_id,order_id,item_id,quantity)values(:order_position_id, :order_id, :item_id, :quantity);`;
    const orderPosition_params = [
      { name: 'order_position_id', value: { stringValue: orderPositionId } },
      { name: 'order_id', value: { stringValue: orderId } },
      { name: 'item_id', value: { stringValue: e.itemId } },
      { name: 'quantity', value: { longValue: e.quantity || 'NULL' } },
    ];
    const params_orderPosition = get_db_params(
      orderPosition_SqlStatment,
      orderPosition_params,
    );
    const result_orderPosition = await dbConnector(params_orderPosition);
    console.log('result_orderPosition', result_orderPosition);
  });

  return { orderId };
};

export const invoicing = async order => {
  const itemArr = order.positions;
  const invoiceId = uuid();

  //create invoice Position for item position ////////////////////////////////////////////////////////////////////////////////

  itemArr.map(async e => {
    const invoicePositionId = uuid();
    const invoicePosition_SqlStatment = `insert into ORDERS.INVOICE_POSITION
    (invoice_position_id, invoice_id, order_position_id, invoice_position_type_nr, raw_amount, net_amount, tax_amount, weight, item_id, quantity)
    values(:invoice_position_id, :invoice_id, :order_position_id, :invoice_position_type_nr, :raw_amount, :net_amount, :tax_amount, :weight, :item_id, :quantity);`;
    const invoicePosition_params = [
      {
        name: 'invoice_position_id',
        value: { stringValue: invoicePositionId },
      },
      { name: 'invoice_id', value: { stringValue: invoiceId } },
      { name: 'order_position_id', value: { stringValue: e.orderPositionId } },
      {
        name: 'invoice_position_type_nr',
        value: { longValue: 1 }, //1=item position
      },
      { name: 'weight', value: { longValue: e.weight || 0 } },
      { name: 'raw_amount', value: { doubleValue: e.rawAmount } },
      { name: 'net_amount', value: { doubleValue: e.price - e.taxAmount } },
      { name: 'tax_amount', value: { doubleValue: e.taxAmount } },
      { name: 'item_id', value: { stringValue: e.itemId } },
      { name: 'quantity', value: { longValue: e.quantity || 0 } },
    ];
    const params_invoicePosition = get_db_params(
      invoicePosition_SqlStatment,
      invoicePosition_params,
    );

    await dbConnector(params_invoicePosition);
  });
  // create invoice position for delivery deliveryFee
  const invoicePositionDFId = uuid();
  const invoicePositionDF_SqlStatment = `insert into ORDERS.INVOICE_POSITION
    (invoice_position_id, invoice_id, order_position_id, invoice_position_type_nr, raw_amount, net_amount, tax_amount, weight,  quantity)
    values(:invoice_position_id, :invoice_id, :order_position_id, :invoice_position_type_nr, :raw_amount, :net_amount, :tax_amount, :weight,  :quantity);`;
  const deliveryFeetax = (7 * order.deliveryFee) / 107;
  const deliveryFeenet = order.deliveryFee - deliveryFeetax;
  const invoicePositionDF_params = [
    {
      name: 'invoice_position_id',
      value: { stringValue: invoicePositionDFId },
    },
    { name: 'invoice_id', value: { stringValue: invoiceId } },
    { name: 'order_position_id', value: { stringValue: '999' } }, // later make the field nullable in DB
    {
      name: 'invoice_position_type_nr',
      value: { longValue: 2 }, //2=delivery
    },
    { name: 'weight', value: { longValue: 0 } }, // later make the field nullable in DB
    { name: 'raw_amount', value: { doubleValue: order.deliveryFee } },
    { name: 'net_amount', value: { doubleValue: deliveryFeenet } },
    { name: 'tax_amount', value: { doubleValue: deliveryFeetax } },
    { name: 'quantity', value: { longValue: 1 } },
  ];
  const params_invoicePositionDF = get_db_params(
    invoicePositionDF_SqlStatment,
    invoicePositionDF_params,
  );

  await dbConnector(params_invoicePositionDF);
  // Tax value ist Total tax over positions plus tax from delivery fee
  const totalTaxAmountDF = order.totalTaxAmount + deliveryFeetax;
  const totalNetAmount = order.totalRawAmount - totalTaxAmountDF;
  //create order invoice////////////////////////////////////////////////////////////////////////////////
  const orderInvoice_SqlStatment = `
  INSERT INTO ORDERS.INVOICE 
  (invoice_id,customer_id, order_id, payment_id, shop_nr, total_raw_amount, total_net_amount, total_tax_amount, total_full_amount) 
  VALUES (:invoice_id,:customer_id, :order_id , :payment_id, :shop_nr, :total_raw_amount, :total_net_amount, :total_tax_amount, :total_full_amount);
  `;
  const orderInvoice_params = [
    { name: 'invoice_id', value: { stringValue: invoiceId } },
    { name: 'customer_id', value: { stringValue: order.customer.customerId } },
    { name: 'order_id', value: { stringValue: order.orderId } },
    { name: 'payment_id', value: { stringValue: order.payment.paymentId } },
    { name: 'shop_nr', value: { stringValue: order.shop.shopId } },
    { name: 'total_raw_amount', value: { doubleValue: order.totalRawAmount } },
    {
      name: 'total_net_amount',
      value: { doubleValue: totalNetAmount },
    },
    { name: 'total_tax_amount', value: { doubleValue: totalTaxAmountDF } },
    {
      name: 'total_full_amount',
      value: { doubleValue: order.totalRawAmount },
    }, // Full amount without voucher (no voucher for MVP)
  ];
  const params_orderInvoice = get_db_params(
    orderInvoice_SqlStatment,
    orderInvoice_params,
  );

  await dbConnector(params_orderInvoice);
  return invoiceId;
};

// all needed data for E-mail
export const getDataForEmail = async invoiceId => {
  const sqlStatement = ` select sum(invp1.raw_amount) as sum_items, sum(invp2.raw_amount) as delfee, inv.total_raw_amount as invoice_sum,
  inv.total_tax_amount as tax, inv.invoice_number as invoice_no, date_format(inv.invoice_date, "%d.%m.%Y") as inv_date,
  met.payment_method_name as payment_method
  from ORDERS.INVOICE inv
  join ORDERS.PAYMENT pay on inv.payment_id=pay.payment_id
  join PARAM.PAYMENT_METHOD met on pay.payment_method_nr=met.payment_method_nr
  join ORDERS.INVOICE_POSITION  invp1 on inv.invoice_id=invp1.invoice_id
  join ORDERS.INVOICE_POSITION  invp2 on inv.invoice_id=invp2.invoice_id
  where inv.invoice_id=:inv_id
  and invp1.invoice_position_type_nr=1 and invp2.invoice_position_type_nr=2;`;
  const sqlParameter = [{ name: 'inv_id', value: { stringValue: invoiceId } }];
  const params = get_db_params(sqlStatement, sqlParameter);
  const result = await dbConnector(params);
  const mapped_result = map_db_response(invDataCols, result);
  return mapped_result[0];
};

export const createNewContact = async contact => {
  const sqlStatement = `INSERT INTO CUSTOMER.CONTACT(firstname, lastname, email, order_id, description) VALUES(:firstname, :lastname, :email, :order_id, :description)`;

  const sqlParameter = [
    { name: 'firstname', value: { stringValue: contact.firstName } },
    { name: 'lastname', value: { stringValue: contact.lastName } },
    { name: 'email', value: { stringValue: contact.email } },
    {
      name: 'order_id',
      value: contact.orderId
        ? { stringValue: contact.orderId }
        : { isNull: true },
    },
    { name: 'description', value: { stringValue: contact.description } },
  ];
  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return result;
};

export const updateCustomerAddress = async address => {
  if (address.defaultAddress) {
    await updateDefaultAddress();
  }
  const sqlStatement = `UPDATE CUSTOMER.ADDRESS address set
    address_type_nr =:address_type_nr,
    salutation =:salutation,
    title =:title,
    first_name =:first_name,
    last_name =:last_name,
    street =:street,
    house_number =:house_number,
    zip =:zip,
    city =:city,
    address_addtion =:address_addtion,
    default_address =:default_address
     WHERE address.address_id = :address_id;`;

  const sqlParameter = [
    { name: 'address_type_nr', value: { longValue: address.addressType } },
    { name: 'address_id', value: { stringValue: address.addressId } },
    {
      name: 'salutation',
      value: { stringValue: address.salutation ? address.salutation : 'hi' },
    },
    {
      name: 'title',
      value: {
        stringValue: address.title ? address.title : 'address title',
      },
    },
    { name: 'first_name', value: { stringValue: address.firstName } },
    { name: 'last_name', value: { stringValue: address.lastName } },
    { name: 'street', value: { stringValue: address.street } },
    {
      name: 'house_number',
      value: {
        stringValue: address.houseNumber ? address.houseNumber : '',
      },
    },
    { name: 'zip', value: { stringValue: address.zip } },
    { name: 'city', value: { stringValue: address.city } },
    {
      name: 'address_addtion',
      value: {
        stringValue: address.addressAddition ? address.addressAddition : '',
      },
    },
    {
      name: 'default_address',
      value: {
        booleanValue: address.defaultAddress ? address.defaultAddress : false,
      },
    },
  ];
  const params = get_db_params(sqlStatement, sqlParameter);
  await dbConnector(params);
  // const result = await dbConnector(params);
  return address.addressId;
};

export const updateDefaultAddress = async () => {
  const sqlStatement = `update CUSTOMER.ADDRESS set default_address= :default_address`;

  const sqlParameter = [
    { name: 'default_address', value: { booleanValue: false } },
  ];
  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return result;
};

export const insertAddress = async address => {
  const customerId = await getCustomerIdByUserName(address.userName);

  if (customerId != undefined) {
    if (address.defaultAddress) {
      await updateDefaultAddress();
    }
    const addressId = uuid();
    const sqlStatement = `INSERT INTO CUSTOMER.ADDRESS(
      address_id ,
      customer_id,
      address_type_nr,
      salutation ,
        title ,
        first_name ,
        last_name ,
        street ,
        house_number,
        zip ,
        city ,
        address_addtion,
        default_address
      ) 
      VALUES (
      :address_id ,
      :customer_id,
      :address_type_nr,
      :salutation ,
      :title ,
      :first_name ,
      :last_name ,
      :street ,
      :house_number,
      :zip ,
      :city ,
      :address_addtion,
      :default_address);`;

    const sqlParameter = [
      { name: 'address_id', value: { stringValue: addressId } },
      { name: 'customer_id', value: { stringValue: customerId } },
      { name: 'address_type_nr', value: { longValue: address.addressType } },
      {
        name: 'salutation',
        value: { stringValue: address.salutation ? address.salutation : 'hi' },
      },
      {
        name: 'title',
        value: {
          stringValue: address.title ? address.title : 'address title',
        },
      },
      { name: 'first_name', value: { stringValue: address.firstName } },
      { name: 'last_name', value: { stringValue: address.lastName } },
      { name: 'street', value: { stringValue: address.street } },
      {
        name: 'house_number',
        value: { stringValue: address.houseNumber ? address.houseNumber : '' },
      },
      { name: 'zip', value: { stringValue: address.zip } },
      { name: 'city', value: { stringValue: address.city } },
      {
        name: 'address_addtion',
        value: {
          stringValue: address.addressAddition ? address.addressAddition : '',
        },
      },
      {
        name: 'default_address',
        value: {
          booleanValue: address.defaultAddress ? address.defaultAddress : false,
        },
      },
    ];
    const params = get_db_params(sqlStatement, sqlParameter);

    const result = await dbConnector(params);
    console.log(result);
    return addressId;
  } else {
    throw 'Customer not found';
  }
};

export const getCustomerAddress = async customerId => {
  const sqlStatement = `select 
  address_id as addressId,
  address.address_type_nr as addressType,
  address.first_name as firstName,
  address.last_name as lastName,
  address.street as street,
  address.zip as zip,
  address.city as city,
  address.address_addtion as addressAddition
  from CUSTOMER.ADDRESS address where address.customer_id = :customer_id ;`;
  const sqlParameter = [
    { name: 'customer_id', value: { stringValue: customerId } },
  ];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return map_db_response(addressCols, result);
};

export const getCustomerAddressByUser = async userName => {
  const customerId = await getCustomerIdByUserName(userName);

  if (customerId != undefined) {
    const sqlStatement = `select 
    address_id as addressId,
    address.address_type_nr as addressType,
    address.first_name as firstName,
    address.last_name as lastName,
    address.street as street,
    address.zip as zip,
    address.city as city,
    address.address_addtion as addressAddition,
    address.default_address as defaultAddress
    from CUSTOMER.ADDRESS address where address.customer_id = :customer_id ;`;
    const sqlParameter = [
      { name: 'customer_id', value: { stringValue: customerId } },
    ];

    const params = get_db_params(sqlStatement, sqlParameter);

    const result = await dbConnector(params);

    return map_db_response(addressCols, result);
  } else {
    throw 'user not found!';
  }
};
export const getOrderDetails = async customerId => {
  const sqlStatement = `select 
  order_id as orderId,
  shop_nr as shopId ,
  timestamp_created as createdAt,
  timestamp_updated as updatedAt,
  order_status_nr as status,
  from ORDERS.ORDER orders 
  where orders.customer_id = :customer_id ;`;
  const sqlParameter = [
    { name: 'customer_id', value: { stringValue: customerId } },
  ];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return map_db_response(orderCols, result);
};

export const getCustomerDataById = async customerId => {
  const sqlStatement = `select 
salutation,
email,
phone,
title,
first_name as firstName,
last_name as lastName,
language_nr languageNum,
from CUSTOMER.CUSTOMER customer
where customer.customer_id = :customer_id ;`;
  const sqlParameter = [
    { name: 'customer_id', value: { stringValue: customerId } },
  ];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return map_db_response(customerCols, result);
};

export const getShopById = async shopId => {
  const currentDay = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][new Date().getDay()];
  const currentHour = String(new Date().getHours());
  const sqlStatement = `select 
  shop.shop_nr as shopNr,
  shop.shop_name as shopName,
  shop.street,
  shop.street_number as streetNumber,
  shop.zip,
  shop.city,
  shop.latitude,
  shop.longitude,
  shop.minimum_order_value as minimumOrderValue,
  shop.imageUrl,
  shop.delivery_radius as deliveryRadius,
  sitem.Category_nr as categoryId,
  (select gen.value from PARAM.GENERAL_ATTRIBUTES gen where name = 'DELIVERY_FEE' ) as deliveryFee,
  (select holiday_day from SHOP.closed_days where shop_nr = shop.shop_nr) as holidays,
  (SELECT COUNT(*) FROM  SHOP.working_hours  WHERE shop_nr = shop.shop_nr AND ${currentHour} BETWEEN opening_hour AND closing_hour AND working_day like  '%${currentDay}%' ) as isOpen
  from SHOP.SHOP shop join ITEM.shop_item sitem 
  on shop.shop_nr = sitem.shop_nr 
  where shop.shop_nr= :shop_nr
  and shop.unpublish = false
  group by shop.shop_nr;`;

  const sqlParameter = [{ name: 'shop_nr', value: { stringValue: shopId } }];

  const params = get_db_params(sqlStatement, sqlParameter);
  const result = await dbConnector(params);

  return map_db_response(shopCols, result);
};

export const deleteAddressById = async addressId => {
  const sqlStatement_delete =
    'delete from CUSTOMER.ADDRESS where CUSTOMER.ADDRESS.address_id =:address_id;';
  const sqlParameter_delete = [
    { name: 'address_id', value: { stringValue: addressId } },
  ];

  const params_delete = get_db_params(sqlStatement_delete, sqlParameter_delete);
  const result = await dbConnector(params_delete);
  return result;
};

export const preferredAddressByUser = async userName => {
  const customerId = await getCustomerIdByUserName(userName);
  console.log(customerId);

  if (customerId != undefined) {
    const sqlStatement = `select 
    address_id as addressId,
    address.address_type_nr as addressType,
    address.first_name as firstName,
    address.last_name as lastName,
    address.street as street,
    address.zip as zip,
    address.city as city,
    address.address_addtion as addressAddition,
    address.default_address as defaultAddress
    from CUSTOMER.ADDRESS address where address.customer_id = :customer_id and address.default_address = :default_address;`;
    const sqlParameter = [
      { name: 'customer_id', value: { stringValue: customerId } },
      { name: 'default_address', value: { booleanValue: true } },
    ];

    const params = get_db_params(sqlStatement, sqlParameter);

    const result = await dbConnector(params);
    if (map_db_response(addressCols, result).length > 0) {
      return map_db_response(addressCols, result);
    } else {
      const lastAddress = await getLastAddress(customerId);
      return lastAddress;
    }
  } else {
    throw 'user not found!';
  }
};
export const getLastAddress = async customerId => {
  const sqlStatement = `select 
  address_id as addressId,
  address.address_type_nr as addressType,
  address.first_name as firstName,
  address.last_name as lastName,
  address.street as street,
  address.zip as zip,
  address.city as city,
  address.address_addtion as addressAddition,
  address.default_address as defaultAddress
  from CUSTOMER.ADDRESS address where address.customer_id = :customer_id
  and address.created_at=(SELECT MAX(CUSTOMER.ADDRESS.created_at) FROM CUSTOMER.ADDRESS);`;
  const sqlParameter = [
    { name: 'customer_id', value: { stringValue: customerId } },
  ];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return map_db_response(addressCols, result);
};

export const updatePaymentStatus = async (tokenId, status) => {
  const newStatus = status == 'COMPLETED' ? 2 : 1; //2 for Completed,1 for pending

  const sqlStatement_payment = `UPDATE ORDERS.PAYMENT
     SET payment_status_nr= :payment_status_nr
  WHERE transaction_id = :transaction_id`;

  const sqlParameter_payment = [
    { name: 'payment_status_nr', value: { longValue: newStatus } }, //2 for Completed,
    { name: 'transaction_id', value: { stringValue: tokenId } },
  ];
  const params_payment = get_db_params(
    sqlStatement_payment,
    sqlParameter_payment,
  );

  await dbConnector(params_payment);

  // return result;
  /// update order status

  const orderId = await getOrderIdBytokenId(tokenId);
  const sqlStatement_order = `update ORDERS.ORDER set order_status_nr= :order_status_nr, timestamp_updated =now()
  WHERE order_id = :order_id; `;

  const sqlParameter_order = [
    { name: 'order_status_nr', value: { longValue: newStatus } }, //2 for payed = waiting delivery,
    { name: 'order_id', value: { stringValue: orderId } },
  ];

  const params_order = get_db_params(sqlStatement_order, sqlParameter_order);

  await dbConnector(params_order);

  return orderId;
};

export const getOrderIdBytokenId = async tokenId => {
  const sqlStatement = `select order_id as orderId from ORDERS.ORDER where payment_id = (select payment_id from ORDERS.PAYMENT where transaction_id = :transaction_id);`;
  const sqlParameter = [
    { name: 'transaction_id', value: { stringValue: tokenId } },
  ];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);

  return map_db_response(['orderId'], result)[0]?.orderId;
};

export const preSQSInsertion = async order => {
  try {
    const key = isEmail(order.userName) ? 'email' : 'phone';
    const value =
      key == 'phone' ? '+'.concat(order.userName.slice(1)) : order.userName;
    const isUser = await userExists({ [key]: value });
    if (isUser) {
      // const order = data.updatedOrder;
      const customerId = await getCustomerIdByUserName(order.userName);
      const billingAddress = order.billingAddress;
      const deliveryAddress = order.deliveryAddress;

      //add validation for all felids before adding any datasx
      // add email & phone to the CUSTOMER.
      const customer_SqlStatment = `update CUSTOMER.CUSTOMER user set user.email =:email, user.first_name =:first_name, user.last_name =:last_name, 
      user.phone = :phone where user.customer_id = :customer_id;`;
      const customer_Sqlparams = [
        {
          name: 'email',
          value: { stringValue: billingAddress.email || 'NULL' },
        },
        {
          name: 'first_name',
          value: { stringValue: billingAddress.firstName || 'NULL' },
        },
        {
          name: 'last_name',
          value: { stringValue: billingAddress.lastName || 'NULL' },
        },
        {
          name: 'phone',
          value: { stringValue: billingAddress.phoneNumber || 'NULL' },
        },
        { name: 'customer_id', value: { stringValue: customerId } },
      ];

      const customer_params = get_db_params(
        customer_SqlStatment,
        customer_Sqlparams,
      );

      const resultCustomer = await dbConnector(customer_params);
      console.log('result new Customer', resultCustomer);

      const addressType =
        deliveryAddress !== undefined && Object.keys(deliveryAddress).length > 0
          ? 2
          : 1;
      //create billingAddress////////////////////////////////////////////////////////////////////////////////
      if (addressType == 2) {
        deliveryAddress.userName = order.userName;
        deliveryAddress.addressType = 2;
        billingAddress.userName = order.userName;
        billingAddress.addressType = 1;

        if (billingAddress.addressId) {
          // update billing address
          await updateCustomerAddress(billingAddress);
          const deliveryAddressId = await insertAddress(deliveryAddress);
          console.log('1', deliveryAddressId);
          return deliveryAddressId;
        } else {
          await insertAddress(billingAddress);
          const deliveryAddressId = await insertAddress(deliveryAddress);
          console.log('2', deliveryAddressId);
          return deliveryAddressId;
        }
      } else {
        console.log('kkkkkkk,.....,,,,billingAddressId>>>>>', billingAddress);
        billingAddress.userName = order.userName;

        if (billingAddress.addressId) {
          // update billing address
          const deliveryAddressId = await updateCustomerAddress(billingAddress);
          return deliveryAddressId;
        } else {
          const deliveryAddressId = await insertAddress(billingAddress);
          return deliveryAddressId;
        }
      }
    } else {
      throw 'user not found';
    }
  } catch (error) {
    throw error;
  }
};

export const searchItems = async name => {
  const sqlStatement = `SELECT shop.*, 
    FROM ITEM.shop_item shop_item 
    join ITEM.ITEM_NAME item_name
    join ITEM.ITEM item
    join SHOP.SHOP shop
    on shop_item.item_id = item_name.item_id 
    and item.item = shop_item.item_id
    and shop_item.shop_nr = shop.shop_nr
    WHERE item_name.name like '%':name'%'
    group by item_name.name;`;

  const sqlParameter = [{ name: 'name', value: { stringValue: name } }];
  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);
  return map_db_response(itemCols, result);
};

export const getShopHolyday = async shopId => {
  const sqlStatement = `select holiday_day as holidays from SHOP.closed_days where shop_nr = :shop_nr`;
  const sqlParameter = [{ name: 'shop_nr', value: { stringValue: shopId } }];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);

  return map_db_response(['holidays'], result)[0]?.holidays;
};
export const getShopWorkingTime = async shopId => {
  const sqlStatement = `select working_day as workingDays,closing_hour as closing,opening_hour as opening from SHOP.working_hours where shop_nr = :shop_nr`;
  const sqlParameter = [{ name: 'shop_nr', value: { stringValue: shopId } }];

  const params = get_db_params(sqlStatement, sqlParameter);

  const result = await dbConnector(params);

  return map_db_response(['workingDays', 'closing', 'opening'], result)[0];
};
