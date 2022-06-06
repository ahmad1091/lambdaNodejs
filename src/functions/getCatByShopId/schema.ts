import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      shopId: { type: 'number' },
    },
    required: ['queryStringParameters'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        shopId: yup.string().trim().required(),
      })
      .validate(obj),
} as const;
