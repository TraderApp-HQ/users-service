import { DOC_RESPONSE, RESPONSE_TAGS } from "~/config/constants";

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
  tags: [RESPONSE_TAGS.auth],
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
    "200": DOC_RESPONSE.SUCCESS,
    '201': DOC_RESPONSE.REFRESH_TOKEN_SUCCESS,
    "400": DOC_RESPONSE.BADREQUEST,
    '401': DOC_RESPONSE.UNAUTHORIZED,
    '500': DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthRefreshToken, createAuthRefreshTokenBody };