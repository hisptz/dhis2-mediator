import { Config } from "./program";
import { bootstrap } from "../bootstrap";

const configMapping = [
	{
		envKey: "DHIS2_BASE_URL",
		key: "dhis2BaseURL",
	},
	{
		envKey: "DHIS2_USERNAME",
		key: "username",
	},
	{
		envKey: "DHIS2_PASSWORD",
		key: "password",
	},
	{
		envKey: "DHIS2_API_TOKEN",
		key: "token",
	},
	{
		envKey: "CONTEXT_PATH",
		key: "context",
	},
	{
		envKey: "PORT",
		key: "port",
	},
	{
		envKey: "CACHE_TTL",
		key: "cache",
	},
	{
		envKey: "NUMBER_OF_REQUESTS_PER_MINUTE",
		key: "nrpm",
	},
	{
		envKey: "READONLY_RESOURCES",
		key: "readonlyResources",
		get: (resources: string) => resources.split(","),
	},
	{
		envKey: "ALLOWED_RESOURCES",
		key: "resources",
		get: (resources: string) => resources.split(","),
	},
];

export function configureApp(config: Config) {
	configMapping.forEach(({ envKey, key, get }) => {
		const value = config[key];
		if (value) {
			process.env[envKey] = get ? get(value) : value;
		}
	});
}

export function validateConfig(config: Config) {
	const { username, password, token, dhis2BaseURL } = config;
	if (!token) {
		if (!username || !password) {
			console.error(
				"Please provide either a token or both username and password"
			);
			process.exit(1);
		} else {
			console.warn(
				"Basic authentication (username and password) is not recommended. Use personal access token instead"
			);
		}
	}
	if (!dhis2BaseURL) {
		console.error("Please provide a DHIS2 URL");
		process.exit(1);
	}
	if (dhis2BaseURL.match(/https?/)) {
		console.error("Invalid DHIS2 URL");
		process.exit(1);
	}
	return;
}

export function startApp() {
	bootstrap();
}
