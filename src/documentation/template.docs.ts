import { DOC_RESPONSE, RESPONSE_CODES } from "~/config/constants";
import { RESPONSE_TAGS } from "~/config/constants";

const createTemplateBody = {
  type: 'object',
  required: ['test'],
  properties: {
    test: {
      type: 'string',
      example: '',
    },
  },
};

const createTemplate = {
  tags: [RESPONSE_TAGS.auth],
  description: 'Login User in the system',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/createTemplateBody',
        },
      },
    },
    required: true,
  },
  responses: {
    [RESPONSE_CODES.ok]: DOC_RESPONSE.SUCCESS,
    [RESPONSE_CODES.created]: DOC_RESPONSE.LOGIN_SUCCESS,
    [RESPONSE_CODES.badrequest]: DOC_RESPONSE.BADREQUEST,
    [RESPONSE_CODES.unauthorized]: DOC_RESPONSE.UNAUTHORIZED,
    [RESPONSE_CODES.servererror]: DOC_RESPONSE.SERVERERROR
  },
};

export { createTemplate, createTemplateBody };