const createAuthSignupBody = {
  type: 'object',
  properties: {
    first_name: {
      type: 'string',
      example: 'Test',
    },
    last_name: {
      type: 'string',
      example: '123',
    },
    email: {
      type: 'string',
      example: 'Test123@gmail.com',
    },
    password: {
      type: 'string',
      example: 'Test12345@',
    },
    dob: {
      type: 'string',
      example: '12th November 2001',
    },
    country_id: {
      type: 'number',
      example: 234
    }
  },
};

const createAuthSignup = {
  tags: ['Auth'],
  description: 'Create a new user in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthSignupBody',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User created successfully!',
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

export { createAuthSignup, createAuthSignupBody };