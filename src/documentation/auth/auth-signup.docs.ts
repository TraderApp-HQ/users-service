import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "~/config/constants";

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
  tags: [RESPONSE_TAGS.auth],
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
    [RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
    [RESPONSE_CODES.created]: DOC_RESPONSE.REGISTER_SUCCESS,
    [RESPONSE_CODES.badrequest]: DOC_RESPONSE.BADREQUEST,
    [RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
    [RESPONSE_CODES.servererror]: DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthSignup, createAuthSignupBody };