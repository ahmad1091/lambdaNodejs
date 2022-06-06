import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      cartDetails: { type: 'object' },
    },
    required: ['cartDetails'],
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
      })
      .isValid(obj),
} as const;
