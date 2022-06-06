import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      catId: { type: 'number' },
      shopId: { type: 'number' },
    },
    required: ['queryStringParameters'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        shopId: yup.number().required().integer(),
        categoryId: yup.string().trim().required(),
      })
      .isValid(obj),
} as const;
