import { DOCRESPONSE } from "~/config/constants";

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
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.PASSWORDRESETLINKSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createAuthPasswordReset, createAuthPasswordResetBody };