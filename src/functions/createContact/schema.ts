import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      orderId: { type: 'string' },
      description: { type: 'string' },
    },
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        firstName: yup.string().trim().required(),
        lastName: yup.string().trim().required(),
        email: yup.string().email().required(),
        orderId: yup.string(),
        description: yup.string().max(500).required(),
      })
      .isValid(obj),
} as const;
