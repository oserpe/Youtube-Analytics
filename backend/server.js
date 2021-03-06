const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

// MONGODB
const mongoDB = require("./databases/mongo");

// NEO4J
const neo4j = require("./databases/neo4j");

// ELASTICSEARCH
const elasticsearch = require("./databases/elasticsearch");

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

require("./routes/queriesRoutes")(app);

// este es el endpoint "/..." (donde cae todo lo que no matchee)
app.use((req, res, next) => {
	const error = new Error("Endpoint does not exist");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	const status = error.status || 500;
	const message = error.message || "Internal server error";
	res.status(status).json({ message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`SERVER LISTENING ON PORT ${port}`);
});

mongoDB.connect(() => { })
	.then(() => elasticsearch.connect(() => { }))
	.then(() => neo4j.connect(() => { }));

process.on("SIGINT", function () {
	// some other closing procedures go here
	process.exit(0);
});
