import { DOCRESPONSE } from "../config/constants"

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
  tags: ['Auth'],
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
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.LOGOUTSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createAuthLogout, createAuthLogoutBody };