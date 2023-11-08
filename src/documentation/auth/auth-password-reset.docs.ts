import { DOC_RESPONSE, RESPONSE_TAGS } from "~/config/constants";

const createAuthPasswordResetBody = {
  type: 'object',
  required: ['reset_token', 'password', 'user_id'],
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
  tags: [RESPONSE_TAGS.auth],
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
    "200": DOC_RESPONSE.SUCCESS,
    '201': DOC_RESPONSE.PASSWORD_RESET_LINK_SUCCESS,
    "400": DOC_RESPONSE.BADREQUEST,
    '401': DOC_RESPONSE.UNAUTHORIZED,
    '500': DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthPasswordReset, createAuthPasswordResetBody };