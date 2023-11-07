import { DOCRESPONSE } from "~/config/constants";

const createAuthSignupBody = {
  type: 'object',
  required: ['first_name', 'last_name', 'email', 'password', 'dob', 'country_id'],
  properties: {
    first_name: {
      type: 'string',
      example: 'Test',
      required: false
    },
    last_name: {
      type: 'string',
      example: '123',
      required: true
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
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.REGISTERSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createAuthSignup, createAuthSignupBody };