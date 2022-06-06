import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      orderId: { type: 'string' },
      status: { type: 'number' },
    },
    required: ['orderId', 'status'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        orderId: yup.string().trim().required(),
        status: yup.number().required().integer(),
      })
      .isValid(obj),
} as const;
