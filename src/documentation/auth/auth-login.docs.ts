import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

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
    [RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
    [RESPONSE_CODES.created]: DOC_RESPONSE.LOGIN_SUCCESS,
    [RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
    [RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
    [RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthLogin, createAuthLoginBody };