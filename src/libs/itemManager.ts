import {
  getItemsQ,
  getById,
  getByCategory,
  filterItems,
  categorizedItems,
  catByShopId,
  insertCustomer,
  getByItemName,
  insertAddress,
  getCustomerAddress,
  getCustomerAddressByUser,
  getOrderDetails,
  getCustomerDataById,
  updateCustomerAddress,
  deleteAddressById,
  preferredAddressByUser,
  createNewContact,
  searchItems,
  getAllShopInfo,
  getShopById,
} from '@libs/auroraDBPort';
import {
  orderByLocation,
  isNull,
  isEmail,
  formatFilteredObject,
} from './helpers';
import { initialHandle, finalHandle } from './order';
import { getByName } from '@functions/gallery/controller';

export const getItems = async () => {
  const items = await getItemsQ();
  return items;
};

export const getItemsPerId = async id => {
  const items = await getById(id);
  return items;
};

export const getItemsPerCategory = async category => {
  const items = await getByCategory(category);
  return items;
};
export const getAllShopInformation = async shopId => {
  const shop = await getAllShopInfo(shopId);
  return shop;
};

export const getFilteredItems = async params => {
  const items = await filterItems(params);
  return items;
};

export const getFilteredItemsByCatShop = async params => {
  const items = await categorizedItems(params);
  return items;
};

export const getByShopId = async params => {
  const { shopId } = params;
  const cats = await catByShopId(shopId);
  const result = {};
  const { imageUrl } = await getByName({
    location: 'top-banner',
    description: 'category',
  });

  result['topBanner'] = {
    title: 'header',
    imageUrl,
  };
  result['categories'] = cats;
  return result;
};

export const ShopById = async shopId => {
  const shop = await getShopById(shopId);
  return shop;
};

export const getShopsPerLocation = async location => {
  try {
    const { lat, long, placeId } = location;

    if ((isNull(lat) || isNull(long)) && isNull(placeId)) {
      throw 'Check your params';
    } else {
      const shopObj = await formatFilteredObject();

      const filteredShops = await orderByLocation(location, shopObj);
      const { imageUrl } = await getByName({
        location: 'top-banner',
        description: 'shop',
      });

      const result = {};
      result['topBanner'] = {
        title: 'header',
        imageUrl,
      };
      result['shops'] = filteredShops;
      return result;
    }
  } catch (err) {
    throw String(err);
  }
};

export const newCustomer = async userName => {
  const key = isEmail(userName) ? 'email' : 'phone';
  const result = await insertCustomer({ [key]: userName });
  return result;
};

export const getItemsByName = async itemName => {
  const result = await getByItemName(itemName);
  return result;
};

export const sendMessage = async order => {
  try {
    const result = await initialHandle(order);
    return result;
  } catch (err) {
    throw err;
  }
};

export const receiveFromQue = async order => {
  const result = await finalHandle(order);
  return result;
};
export const newContact = async contact => {
  const result = await createNewContact(contact);
  return result;
};

export const newAddress = async address => {
  console.log('address', address);

  if (address.addressId) {
    const result = await updateCustomerAddress(address);
    return result;
  } else {
    const result = await insertAddress(address);
    return result;
  }
};

export const customerAddressById = async customerId => {
  const result = await getCustomerAddress(customerId);
  return result;
};

export const customerAddressByUserName = async userName => {
  const result = await getCustomerAddressByUser(userName);
  return result;
};
export const getCustomerOrders = async customerId => {
  const result = await getOrderDetails(customerId);
  return result;
};
export const customerById = async customerId => {
  const result = await getCustomerDataById(customerId);
  return result;
};

export const removeAddress = async addressId => {
  const result = await deleteAddressById(addressId);
  return result;
};

export const getPreferredAddress = async userName => {
  const result = await preferredAddressByUser(userName);
  return result;
};

export const searchItemsByName = async name => {
  const result = await searchItems(name);
  return result;
};
