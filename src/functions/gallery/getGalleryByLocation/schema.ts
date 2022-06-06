import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      location: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['location', 'description'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        location: yup.string().trim(),
        description: yup.string().trim(),
      })
      .isValid(obj),
} as const;
