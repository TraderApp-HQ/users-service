import { DOCRESPONSE } from "~/config/constants";

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
  tags: ['Auth'],
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
    "200": DOCRESPONSE.SUCCESS,
    '201': DOCRESPONSE.LOGINSUCCESS,
    "400": DOCRESPONSE.BADREQUEST,
    '401': DOCRESPONSE.UNAUTHORIZED,
    '500': DOCRESPONSE.SERVERERROR
  },
};

export { createTemplate, createTemplateBody };