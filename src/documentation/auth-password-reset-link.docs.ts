import { DOCRESPONSE } from "~/config/constants";

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
  tags: ['Auth'],
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
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.PASSWORDRESETLINKSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createAuthPasswordLinkReset, createAuthPasswordLinkResetBody };