// interface IDOC_RESPONSE {
// 	description: string
// }

export const generateResponseObject = (description: string) => {
	return {
		description: description,
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
            data: {
              type: 'object',
              example: {},
            },
            error: {
              type: 'string',
              example: null,
            },
            message: {
              type: 'string',
              example: 'Response is successful',
            },
          }
				},
			},
		},
	}
}