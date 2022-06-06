import axios from 'axios';
import { sortByDistDM } from './index';
import { isNull } from './isNullish';

export const orderByLocation = async (
  location: { placeId: string; lat: any; long: any },
  shops: [any],
) => {
  try {
    const { placeId, lat, long } = location;

    const apiKey = process.env.GOOGLEAPIKEY;
    // const origin = `${lat},${long}`;
    const origin = !isNull(placeId) ? `place_id:${placeId}` : `${lat},${long}`;

    const destinations = shops
      ? shops.reduce((acc, e) => {
          return (acc += `${e.latitude},${e.longitude}|`);
        }, '')
      : [];

    const response = await axios({
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origin}&key=${apiKey}`,
    });
    const openOrderedShop = shops.filter((e, index) => {
      return (
        response.data.rows[0].elements[index].status == 'OK' &&
        response.data.rows[0].elements[index].distance.value <
          e.deliveryRadius * 1000 &&
        !e.closed &&
        (e['location'] = response.data.rows[0].elements[index]) &&
        e
      );
    });
    const closedOrderedShop = shops.filter((e, index) => {
      return (
        response.data.rows[0].elements[index].status == 'OK' &&
        response.data.rows[0].elements[index].distance.value <
          e.deliveryRadius * 1000 &&
        e.closed &&
        (e['location'] = response.data.rows[0].elements[index]) &&
        e
      );
    });
    openOrderedShop.sort(sortByDistDM);
    closedOrderedShop.sort(sortByDistDM);
    return [...openOrderedShop, ...closedOrderedShop];
  } catch (err) {
    throw JSON.stringify(err);
  }
};
