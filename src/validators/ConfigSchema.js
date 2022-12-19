const Joi = require('joi');

const ConfigSchema = Joi.object({
	postgres: Joi.object({
		password: Joi.string().required(),
		user: Joi.string().required(),
		host: Joi.string().required(),
		port: Joi.number().required(),
	}).required(),
	mongo: Joi.object({
		host: Joi.string().required(),
		database: Joi.string().required(),
	}).required(),
	joiner: Joi.object({
		client_id: Joi.string(),
		access_token: Joi.string(),
		desired_viewcount: Joi.number(),
	}),
	backend: Joi.object({
		port: Joi.number(),
		origin: Joi.string(),
		client_id: Joi.string(),
		client_secret: Joi.string(),
		callback_url: Joi.string(),
	}),
	token: Joi.object({
		key: Joi.string(),
	}),
	twitch: Joi.object({
		username: Joi.string().required(),
		oauth: Joi.string().required(),
		gql_token: Joi.string().required(),
		access_token: Joi.string().required(),
		client_id: Joi.string().required(),
		stv_token: Joi.string().required(),
	}).required(),
	twitter: Joi.object({
		app_key: Joi.string().required(),
		app_secret: Joi.string().required(),
		access_token: Joi.string().required(),
		access_secret: Joi.string().required(),
		bearer: Joi.string().required(),
	}).required(),
	reddit: Joi.object({
		gql_token: Joi.string().required(),
	}).required(),
	discord: Joi.object({
		poro_logs: Joi.string().required(),
		errors: Joi.string().required(),
		racist: Joi.string().required(),
		new_channels: Joi.string().required(),
		action: Joi.string().required(),
		poro_give: Joi.string().required(),
	}).required(),
});

module.exports = { ConfigSchema };
