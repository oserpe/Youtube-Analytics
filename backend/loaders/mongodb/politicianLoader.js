const mongoDB = require("../../databases/mongo");
const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

function parseCsvLine(line) {
  const values = line.split(",");
  return {
    fullname: values[0] || "",
    party: values[1] || "",
    aliases: values[2] ? values[2].split("|") : [],
  };
}

async function load() {
  const db = mongoDB.getDB();

  await fsPromises.readFile(path.resolve(__dirname, "../..", "datasets", "politicians.csv"))
    .then(async data => {   
      data = data.toString();
      // removing header
      const lines = data.split("\n").slice(1);
      for (const line of lines) {
        const politician = parseCsvLine(line);
        await db.collection("politicians").updateOne(
          { fullname: politician.fullname },
          { $set: politician },
          { upsert: true }
        );
      };
    })
    .catch(error => console.error("MongoDB: Loading politicians\n" + error));

  console.log("MongoDB: Politicians loaded");
}

module.exports = load;
