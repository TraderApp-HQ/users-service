import * as Joi from "joi";

// Function to convert Joi type to Swagger type
function joiTypeToSwaggerType(joiType: string): string {
	const typeMap: Record<string, string> = {
		string: "string",
		number: "number",
		boolean: "boolean",
		array: "array",
		object: "object",
		date: "string",
	};

	return typeMap[joiType] || "string";
}

// Function to convert a Joi schema to Swagger schema
function convertJoiToSwaggerSchema(joiSchema: Joi.Schema): any {
	const swaggerSchema: any = { type: undefined };
	const schemaDescription = joiSchema.describe();

	swaggerSchema.type = joiTypeToSwaggerType(schemaDescription.type as string);

	if (schemaDescription.flags) {
		if (
			"presence" in schemaDescription.flags &&
			schemaDescription.flags.presence === "required"
		) {
			swaggerSchema.required = true;
		}
		if ("default" in schemaDescription.flags) {
			swaggerSchema.default = schemaDescription.flags.default;
		}
	}

	if (schemaDescription.type === "object" && schemaDescription.keys) {
		swaggerSchema.properties = {};
		for (const key in schemaDescription.keys) {
			swaggerSchema.properties[key] = convertJoiToSwaggerSchema(schemaDescription.keys[key]);
		}
	}

	if (schemaDescription.type === "array" && schemaDescription.items) {
		swaggerSchema.items = convertJoiToSwaggerSchema(schemaDescription.items[0]);
	}

	if (schemaDescription.rules) {
		for (const rule of schemaDescription.rules) {
			if (rule.name === "min") {
				swaggerSchema.minimum = rule.args.limit;
			}
			if (rule.name === "max") {
				swaggerSchema.maximum = rule.args.limit;
			}
			if (rule.name === "length") {
				swaggerSchema.minLength = rule.args.limit;
				swaggerSchema.maxLength = rule.args.limit;
			}
			if (rule.name === "valid" && Array.isArray(rule.args.values)) {
				swaggerSchema.enum = rule.args.values;
			}
		}
	}

	return swaggerSchema;
}

export { convertJoiToSwaggerSchema };
