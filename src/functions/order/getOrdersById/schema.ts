import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      userName: { type: 'object' },
    },
    required: ['userName'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        userName: yup.string().trim(),
      })
      .isValid(obj),
} as const;
