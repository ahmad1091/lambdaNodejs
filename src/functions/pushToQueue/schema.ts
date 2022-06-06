import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      phoneNumber: { type: 'string' },
    },
    required: ['phoneNumber'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        cartDetails: yup.object().shape({
          items: yup.array().of(
            yup.object().shape({
              itemId: yup.string(),
              quantity: yup.string(),
            }),
          ),
        }),
        shopId: yup.string(),
        customerId: yup.string(),
        deliveryOptions: yup.string(),
        paymentOptions: yup.string(),
        pillingAddress: yup.object().shape({
          firstName: yup.string(),
          lastName: yup.string(),
          city: yup.string(),
          postCode: yup.string(),
          additionalAddress: yup.string(),
          street: yup.string(),
          email: yup.string(),
          phoneNumber: yup.string(),
        }),
        deliveryAddress: yup.object().shape({
          defaultAddress: yup.boolean().default(false),
          firstName: yup.string(),
          lastName: yup.string(),
          city: yup.string(),
          postCode: yup.string(),
          additionalAddress: yup.string(),
          street: yup.string(),
        }),
      })
      .isValid(obj),
} as const;
