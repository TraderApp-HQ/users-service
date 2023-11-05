const createAuthLoginBody = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'ekidhaja@gmail.com',
    },
    password: {
      type: 'string',
      example: 'Test12345@',
    },
  },
};

const createAuthLogin = {
  tags: ['Auth'],
  description: 'Login User in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthLoginBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User Logged in successfully!',
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

export { createAuthLogin, createAuthLoginBody };