import { getShopsQ } from '@libs/auroraDBPort';
const categories = {
  1: 'Fruits',
  3: 'Spreads',
  5: 'dinner',
  6: 'Snacks',
  7: 'Vegetables',
  8: 'dinner',
  12: 'Snacks',
  13: 'dinner',
  14: 'Test',
  15: 'Snacks',
  16: 'Fleisch und Wurst',
};

const handler = {
  get: function (target, name) {
    return target.hasOwnProperty(name) ? target[name] : 'others';
  },
};

const p = new Proxy(categories, handler);
export const formatFilteredObject = async () => {
  const formated = {};
  const shops = await getShopsQ();
  const isHoliday = holidays => {
    if (holidays) {
      return JSON.parse(holidays).reduce((acc, e) => {
        return acc || new Date(e).getDate() == new Date().getDate();
      }, false);
    }
    return false;
  };

  await shops?.map(e => {
    formated[e.shopNr] = {
      shopNr: e.shopNr,
      shopName: e.shopName,
      street: e.street,
      streetNumber: e.streetNumber,
      zip: e.zip,
      city: e.city,
      latitude: e.latitude,
      longitude: e.longitude,
      minimumOrderValue: e.minimumOrderValue,
      imageUrl: e.imageUrl,
      deliveryRadius: e.deliveryRadius,
      deliveryFee: e.deliveryFee,
      closed: !e.isOpen || isHoliday(e.holidays),
      categories:
        formated[e.shopNr]?.categories?.length > 0
          ? [...new Set([...formated[e.shopNr]?.categories, p[e.categoryId]])]
          : [p[e.categoryId]],
    };
  });

  return Object.values(formated);
};
