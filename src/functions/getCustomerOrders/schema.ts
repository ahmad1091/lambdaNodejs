import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      customerId: { type: 'string' },
    },
    required: ['queryStringParameters'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        customerId: yup.string().trim().required(),
      })
      .validate(obj),
} as const;
