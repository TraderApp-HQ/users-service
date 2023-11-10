import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

const createAuthPasswordLinkResetBody = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      example: '12345678',
    },
  },
};

const createAuthPasswordLinkReset = {
  tags: [RESPONSE_TAGS.auth],
  description: 'Reset Password in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthPasswordLinkResetBody',
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

export { createAuthPasswordLinkReset, createAuthPasswordLinkResetBody };