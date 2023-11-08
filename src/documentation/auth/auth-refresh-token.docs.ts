import { DOC_RESPONSE, RESPONSE_CODES, RESPONSE_TAGS } from "../../config/constants";

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
    [RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
    [RESPONSE_CODES.created]: DOC_RESPONSE.REFRESH_TOKEN_SUCCESS,
    [RESPONSE_CODES.badRequest]: DOC_RESPONSE.BADREQUEST,
    [RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
    [RESPONSE_CODES.serverError]: DOC_RESPONSE.SERVERERROR
  },
};

export { createAuthRefreshToken, createAuthRefreshTokenBody };