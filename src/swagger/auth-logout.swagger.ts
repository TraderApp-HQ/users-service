const createAuthLogoutBody = {
  type: 'object',
  properties: {
    refresh_token: {
      type: 'string',
      example: '12345678',
    },
  },
};

const createAuthLogout = {
  tags: ['Auth'],
  description: 'Logout User in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthLogoutBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User Logged out successfully!',
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

export { createAuthLogout, createAuthLogoutBody };