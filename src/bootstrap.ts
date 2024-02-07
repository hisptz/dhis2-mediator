import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./modules/dhis/utilities/exception.filter";
import { Logger } from "@nestjs/common";

export async function bootstrap() {
	const contextPath =
		process.env.MEDIATOR_CONTEXT_PATH ?? process.env.CONTEXT_PATH;
	const globalPrefix = `${contextPath ?? ""}api`;
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "log", "warn"],
	});
	app.enableCors({
		origin: function (requestOrigin, callback) {
			callback(null, true);
		},
		credentials: true,
	});
	app.useGlobalFilters(new HttpExceptionFilter());
	app.setGlobalPrefix(globalPrefix);
	const port = process.env.MEDIATOR_PORT || process.env.PORT || 3000;
	await app.listen(port, () => {
		Logger.log(
			`Connected to DHIS2 instance: ${process.env.DHIS2_BASE_URL}`
		);
		Logger.log(
			`Mediator now available at localhost:${port}/${globalPrefix}`
		);
	});
}
