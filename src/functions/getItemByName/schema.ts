import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      queryStringParameters: { type: 'object' },
    },
    required: ['queryStringParameters'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        itemName: yup.string().trim().required(),
      })
      .isValid(obj),
} as const;
