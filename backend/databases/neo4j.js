const neo4j = require('neo4j-driver')

let driver;

function connect(callback){
	driver = neo4j.driver(process.env.NEO4J_URI);
	console.log("Connected to Neo4j");
    callback();
}

function getSession() {
  return driver.session();
}

async function closeSession(session) {
    await session.close();
}

module.exports = {
    connect,
    getSession,
	closeSession
}