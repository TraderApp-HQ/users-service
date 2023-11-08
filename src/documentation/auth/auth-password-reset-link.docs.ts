import { DOC_RESPONSE, RESPONSE_TAGS } from "~/config/constants";

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
    "200": DOC_RESPONSE.SUCCESS,
    '201': DOC_RESPONSE.PASSWORD_RESET_LINK_SUCCESS,
    "400": DOC_RESPONSE.BADREQUEST,
    '401': DOC_RESPONSE.UNAUTHORIZED,
    '500': DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthPasswordLinkReset, createAuthPasswordLinkResetBody };