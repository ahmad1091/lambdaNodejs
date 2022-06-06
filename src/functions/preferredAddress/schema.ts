import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      userName: { type: 'string' },
    },
    required: ['queryStringParameters'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        userName: yup.string().trim().required(),
      })
      .validate(obj),
} as const;
