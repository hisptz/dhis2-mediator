import { Config } from "./index";
import console from "console";
import { bootstrap } from "../bootstrap";

export function configureApp(config: Config) {
	process.env.DHIS2_BASE_URL = config.link;
	process.env.DHIS2_USERNAME = config.username;
	process.env.DHIS2_PASSWORD = config.password;
	process.env.DHIS2_API_TOKEN = config.token;
	process.env.CONTEXT_PATH = config.context;
	process.env.PORT = config.port.toString();
	process.env.CACHE_TTL = config.cache;
	process.env.NUMBER_OF_REQUESTS_PER_MINUTE = config.requests;
	process.env.READONLY_RESOURCES = config.readonlyResources;
	process.env.ALLOWED_RESOURCES = config.resources;
}

export function validateConfig(config: Config) {
	const { username, password, token, link } = config;
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
	if (!link) {
		console.error("Please provide a DHIS2 URL");
		process.exit(1);
	}
	if (link.match(/https?/)) {
		console.error("Invalid DHIS2 URL");
		process.exit(1);
	}
	return;
}

export function startApp() {
	bootstrap();
}
