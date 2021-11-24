const mongoDB = require("../../databases/mongo");
const elasticDB = require("../../databases/elasticsearch");

async function load() {
  const mongoClient = mongoDB.getDB();
  const elasticClient = elasticDB.getDB();
  try {
    await elasticClient.indices.create({
      index: "videos",
      body: {
        mappings: {
          video: {
            properties: {
              video_id: { type: "text" },
              title: { type: "text" },
              description: { type: "text" },
              channel_id: { type: "text" },
              published_at: {
                type: "date",
                format: "YYYY-MM-DD'T'HH:mm:ssZ",
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
  }

  console.log("After index creation");

  const videos = await mongoClient
    .collection("videos")
    .find()
    .toArray()
    .then(async (videos) => {
      for (const video of videos) {
        try {
          await elasticClient.index({
            index: "videos",
            body: {
              video_id: video._id,
              title: video.title,
              description: video.description,
              channel_id: video.channel_id,
              published_at: video.published_at,
            },
          });
        } catch (err) {
          console.error(err);
        }
      }
    });

  // We need to force an index refresh at this point, otherwise we will not
  // get any result in the consequent search
  await elasticClient.indices.refresh({ index: "videos" });

  // Let's search!
  const { body } = await elasticClient.search({
    index: "videos",
    body: {
      query: {
        match: { title: "CFK" },
      },
    },
  });

  console.log(body.hits.hits);
}

module.exports = load;
