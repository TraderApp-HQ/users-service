import { DOC_RESPONSE } from "~/config/constants";
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
    "200": DOC_RESPONSE.SUCCESS,
    '201': DOC_RESPONSE.LOGIN_SUCCESS,
    "400": DOC_RESPONSE.BADREQUEST,
    '401': DOC_RESPONSE.UNAUTHORIZED,
    '500': DOC_RESPONSE.SERVERERROR
  },
};

export { createTemplate, createTemplateBody };