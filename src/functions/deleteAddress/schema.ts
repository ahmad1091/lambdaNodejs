import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      addressId: { type: 'string' },
    },
    required: ['addressId'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        addressId: yup.string().trim().required(),
      })
      .isValid(obj),
} as const;
