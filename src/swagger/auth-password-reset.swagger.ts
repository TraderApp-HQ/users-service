const createAuthPasswordResetBody = {
  type: 'object',
  properties: {
    reset_token: {
      type: 'string',
      example: '12345678',
    },
    password: {
      type: 'string',
      example: 'Test12345@',
    },
    user_id: {
      type: 'string',
      example: '12345678',
    },
  },
};

const createAuthPasswordReset = {
  tags: ['Auth'],
  description: 'Reset Password in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthPasswordResetBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'Password Resetted in successfully!',
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

export { createAuthPasswordReset, createAuthPasswordResetBody };