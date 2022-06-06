import * as yup from 'yup';

export default {
  typeSchema: {
    type: 'object',
    properties: {
      addressType: { type: 'number' },
    },
    required: ['addressType'],
  },
  bodySchema: obj =>
    yup
      .object()
      .shape({
        addressType: yup.number().required(),
        userName: yup.string().trim().required(),
        salutation: yup.string().trim(),
        title: yup.string().trim(),
        firstName: yup.string().trim(),
        lastName: yup.string().trim(),
        street: yup.string().trim(),
        houseNumber: yup.string().trim(),
        zip: yup.string().trim(),
        city: yup.string().trim(),
        addressAddition: yup.string().trim(),
        defaultAddress: yup.boolean().default(false),
        addressId: yup.string().trim(),
      })
      .isValid(obj),
} as const;
