const mongoDB = require("../../databases/mongo");
const fs = require("fs");
const path = require("path");

function parseCsvLine(line) {
  const values = line.split(",");
  return {
    fullname: values[0] || "",
    party: values[1] || "",
    aliases: values[2] ? values[2].split("|") : [],
  };
}

function load() {
  const db = mongoDB.getDB();

  fs.readFile(
    path.resolve(__dirname, "../..", "datasets", "politicians.csv"),
    "utf-8",
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      // removing header
      const lines = data.split("\n").slice(1);
      lines.forEach((line) => {
        const politician = parseCsvLine(line);
        db.collection("politicians").updateOne(
          { fullname: politician.fullname },
          { $set: politician },
          { upsert: true }
        );
      });
    }
  );

  console.log("MongoDB: Politicians loaded");
}

module.exports = load;
