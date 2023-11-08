import { DOC_RESPONSE, RESPONSE_TAGS } from "~/config/constants";

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
  tags: [RESPONSE_TAGS.auth],
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
    "200": DOC_RESPONSE.SUCCESS,
    '201': DOC_RESPONSE.LOGIN_SUCCESS,
    "400": DOC_RESPONSE.BADREQUEST,
    '401': DOC_RESPONSE.UNAUTHORIZED,
    '500': DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthLogin, createAuthLoginBody };