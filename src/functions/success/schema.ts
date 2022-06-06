import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      PayerID: { type: 'string' },
    },
    required: ['PayerID', 'paymentId'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        token: yup.string().required(),
        PayerID: yup.string().required(),
      })
      .isValid(obj),
} as const;
