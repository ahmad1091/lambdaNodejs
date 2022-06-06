import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      queryStringParameters: { type: 'object' },
    },
    required: ['queryStringParameters'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        shopId: yup.string().trim().required(),
        categoryId: yup.string().trim().required(),
      })
      .isValid(obj),
} as const;
