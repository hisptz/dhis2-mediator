import { Command } from "commander";
import { configureApp, startApp } from "./start";

const program = new Command();

export interface Config {
	port?: string;
	username?: string;
	password?: string;
	token?: string;
	context?: string;
	dhis2BaseURL?: string;
	resources?: string;
	readonlyResources?: string;
	cache?: string;
	nrpm?: string;
}

program
	.name("dhis2-mediator")
	.description(
		"A mediator between a DHIS2 instance and a front end application for handling authentication and allow whitelisting of DHIS2 API resources."
	);

program
	.command("start")
	.option("--port <number>", "Port to run the mediator")
	.option("--dhis2BaseURL <string>", "DHIS2 URL")
	.option("--username <string>", "DHIS2 Username")
	.option("--password <string>", "DHIS2 Password")
	.option(
		"--token <token>",
		"DHIS2 personal access token (Preferred, used instead of username and password)"
	)
	.option("--context <string>", "Path where the server will be available")
	.option(
		"--resources <string>",
		"Resources to allow access separated by comma (,)"
	)
	.option(
		"--readonlyResources <string>",
		"Allowed resources that should be read only separated by comma (,). (Will only accept GET requests)"
	)
	.option(
		"--cache <number>",
		"Number of milliseconds for caching readonly resources"
	)
	.option("--nrpm <number>", "Number of requests per minute")
	.action((params: Config) => {
		configureApp(params);
		startApp();
	});

export default program;
