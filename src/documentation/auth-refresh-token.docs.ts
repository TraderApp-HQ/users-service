import { DOCRESPONSE } from "~/config/constants";

const createAuthRefreshTokenBody = {
  type: 'object',
  required: ['refresh_token'],
  properties: {
    refresh_token: {
      type: 'string',
      example: '12345678',
    },
  },
};

const createAuthRefreshToken = {
  tags: ['Auth'],
  description: 'Request Refresh Token in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createAuthRefreshTokenBody',
        },
      },
    },
    required: true,
  },
  responses: {
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.REFRESHTOKENSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createAuthRefreshToken, createAuthRefreshTokenBody };