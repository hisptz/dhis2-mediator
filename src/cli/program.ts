import { Command } from "commander";
import { configureApp, startApp, validateConfig } from "./start";

const program = new Command();

export interface Config {
	port: number;
	username: string;
	password: string;
	token: string;
	context?: string;
	link: string;
	resources: string;
	readonlyResources: string;
	cache: string;
	requests: string;
}

program
	.name("dhis2-mediator")
	.description(
		"A mediator between a DHIS2 instance and a front end application for handling authentication and allow whitelisting of DHIS2 API resources."
	);

program
	.command("start")
	.option("-p --port <port>", "Port to run the mediator")
	.option("-l --link <baseURL>", "DHIS2 URL")
	.option("-u --username <username>", "DHIS2 Username")
	.option("-p --password <password>", "DHIS2 Password")
	.option(
		"-t --token <token>",
		"DHIS2 personal access token (Preferred, used instead of username and password)"
	)
	.option("-c --context <context>", "Path where the server will be available")
	.option(
		"-r --resources <resources>",
		"Resources to allow access separated by comma (,)"
	)
	.option(
		" --readonlyResources <readonlyResources>",
		"Allowed resources that should be read only separated by comma (,). (Will only accept GET requests)"
	)
	.option(
		"--cache <cache>",
		"Number of milliseconds for caching readonly resources"
	)
	.option("--nrpm <requests>", "Number of requests per minute")
	.action((params: Config) => {
		validateConfig(params);
		configureApp(params);
		startApp();
	});

export default program;
