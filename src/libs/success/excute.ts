import { clientConfig } from './config';
import { captureOrder } from './captureOrder';
export const handleSuccess = async ids => {
  try {
    const { token } = ids;
    const client = clientConfig();
    const capture = await captureOrder({}, token, client);
    return capture;
  } catch (err) {
    throw err;
  }
};
