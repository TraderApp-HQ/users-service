import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants"

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
    [RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
    [RESPONSE_CODES.created]: DOC_RESPONSE.LOGOUT_SUCCESS,
    [RESPONSE_CODES.badrequest]: DOC_RESPONSE.BADREQUEST,
    [RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
    [RESPONSE_CODES.servererror]: DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthLogout, createAuthLogoutBody };