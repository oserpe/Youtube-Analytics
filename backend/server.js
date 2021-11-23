const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

// MONGODB
const mongoDB = require("./databases/mongo");
const mongoDBLoader = require("./loaders/mongodb");

// NEO4J
const neo4j = require("./databases/neo4j");
const neo4jLoader = require("./loaders/neo4j");

const app = express();

// TODO: agregar winston logger

app.use(bodyParser.json());

require("./routes/testRoutes")(app);

// este es el endpoint "/..." (donde cae todo lo que no matchee)
app.use((req, res, next) => {
	const error = new Error("Endpoint does not exists");
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	const status = error.status || 500;
	const message = error.message || "Internal server error";
	res.status(status).json({ message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`SERVER LISTENING ON PORT ${port}`);
})

if (process.env.NODE_ENV == "load") {
	mongoDB.connect(mongoDBLoader).then(() => {
		neo4j.connect(neo4jLoader);
	});
}
else if (process.env.NODE_ENV == "load-neo") {
	mongoDB.connect(() => { })
		.then(() => neo4j.connect(neo4jLoader));
}
else {
	mongoDB.connect(() => { });
}

process.on('SIGINT', function () {
	// some other closing procedures go here
	process.exit(0);
});