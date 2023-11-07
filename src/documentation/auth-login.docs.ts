import { DOCRESPONSE } from "~/config/constants";

const createAuthLoginBody = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      example: '',
    },
    password: {
      type: 'string',
      example: '',
    },
  },
};

const createAuthLogin = {
  tags: ['Auth'],
  description: 'Login User in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthLoginBody',
        },
      },
    },
    required: true,
  },
  responses: {
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.LOGINSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createAuthLogin, createAuthLoginBody };