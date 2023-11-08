import { DOC_RESPONSE, RESPONSE_TAGS } from "../../config/constants"

const createAuthLogoutBody = {
  type: 'object',
  required: ['refresh_token'],
  properties: {
    refresh_token: {
      type: 'string',
      example: '',
    },
  },
};

const createAuthLogout = {
  tags: [RESPONSE_TAGS.auth],
  description: 'Logout User in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthLogoutBody',
        },
      },
    },
    required: true,
  },
  responses: {
    "200": DOC_RESPONSE.SUCCESS,
    '201': DOC_RESPONSE.LOGOUT_SUCCESS,
    "400": DOC_RESPONSE.BADREQUEST,
    '401': DOC_RESPONSE.UNAUTHORIZED,
    '500': DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthLogout, createAuthLogoutBody };