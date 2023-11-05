const createAuthRefreshTokenBody = {
  type: 'object',
  properties: {
    refresh_token: {
      type: 'string',
      example: '12345678',
    },
  },
};

const createAuthRefreshToken = {
  tags: ['Auth'],
  description: 'Request Refresh Token in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthRefreshTokenBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'Refresh Token requested successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                example: {},
              },
              error: {
                type: 'string',
                example: null,
              },
              message: {
                type: 'string',
                example: 'Response is successful',
              },
            },
          },
        },
      },
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Internal Server Error',
              },
            },
          },
        },
      },
    },
  },
};

export { createAuthRefreshToken, createAuthRefreshTokenBody };