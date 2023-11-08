import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

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
    [RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
    [RESPONSE_CODES.created]: DOC_RESPONSE.PASSWORD_RESET_LINK_SUCCESS,
    [RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
    [RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
    [RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthPasswordReset, createAuthPasswordResetBody };