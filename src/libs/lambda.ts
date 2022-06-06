import * as middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

export const middyfy = handler => {
  return middy.default(handler).use(middyJsonBodyParser());
};
// {
//   "cartDetails": {
//       "items": [
//           {
//               "itemId": "2761fe65-b3a0-4f71-a6b0-72b382b684df",
//               "quantity": 1
//           },
//           {
//               "itemId": "ee9bff7d-cfcc-4bfc-8a12-9a62527925ca",
//               "quantity": 1
//           }
//       ],
//       "shopId": "0d49dbc6-320a-4d1e-b103-668bfbd4cb42"
//   },
//   "userName": "+970599344838",
//   "deliveryOptions": "Pickup (30 Minutes*)",
//   "paymentOptions": "paypal",
//   "billingAddress": {
//       "addressAddition": "Add",
//       "city": "Parañaque",
//       "email": "ahmadsalah.drive@gmail.com",
//       "firstName": "Ahmad",
//       "lastName": "Salah",
//       "phoneNumber": "+970599344838",
//       "street": "Street  house",
//       "zip": "123"
//   },
//   "deliveryAddress": {
//       "deliveryCity": "Parañaque",
//       "deliveryFirstName": "Ahmad",
//       "deliveryLastName": "Salah",
//       "deliveryPostCode": "1233",
//       "deliveryStreetHouse": "Gaza Strip"
//   }
// }
