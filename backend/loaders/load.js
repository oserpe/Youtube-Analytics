require("dotenv").config();

// MONGODB
const mongoDB = require("../databases/mongo");
const mongoDBLoader = require("./mongodb");

// NEO4J
const neo4j = require("../databases/neo4j");
const neo4jLoader = require("./neo4j");

// ELASTICSEARCH
const elasticsearch = require("../databases/elasticsearch");
const elasticsearchLoader = require("./elasticsearch");

switch (process.env.NODE_ENV) {
    case "mongodb":
        mongoDB
            .connect(mongoDBLoader)
            .then(mongoDB.closeConnection);
        break;
    case "neo4j":
        mongoDB
            .connect(() => { })
            .then(() => Promise.resolve(elasticsearch.connect(() => { })))
            .then(() => neo4j.connect(neo4jLoader))
            .then(mongoDB.closeConnection);
        break;
    case "elasticsearch":
        mongoDB
            .connect(() => { })
            .then(() => elasticsearch.connect(elasticsearchLoader))
            .then(mongoDB.closeConnection);
        break;
    case "all":
        mongoDB
            .connect(mongoDBLoader)
            .then(() => elasticsearch.connect(elasticsearchLoader))
            .then(() => neo4j.connect(neo4jLoader))
            .then(mongoDB.closeConnection);
        break;
    default:
        throw new Error("No database(s) specified");
}
