import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      placeId: { type: 'string' },
    },
    required: ['placeId'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        placeId: yup.string().trim(),
        lat: yup.string().trim(),
        long: yup.string().trim(),
      })
      .isValid(obj),
} as const;
