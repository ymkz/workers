import { Validator } from "hono";

export const addSchema = (v: Validator) => ({
	url: v
		.json("url")
		.isRequired()
		.message(`request body 'url' is required as 'string'`),
});

export const delSchema = (v: Validator) => ({
	id: v
		.json("id")
		.isRequired()
		.message(`request body 'id' is required as 'string'`),
});

export const imageSchema = (v: Validator) => ({
	key: v
		.query("key")
		.isRequired()
		.message(`request body 'key' is required as 'string'`),
});
