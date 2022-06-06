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
        userName: yup.string().trim().required(),
      })
      .isValid(obj),
} as const;
