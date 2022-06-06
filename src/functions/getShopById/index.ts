import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'shops/{shopId}',
        cors: true,
        request: {
          parameters: {
            paths: {
              shopId: true,
            },
          },
        },
      },
    },
  ],
};
