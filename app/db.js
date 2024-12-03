const { MongoClient } = require("mongodb");
const MONGODB_URI = "mongodb://mongosrv";
const DB_NAME = "auction";
let cachedDb;

module.exports = {
  connectToDb: async () => {
    if (cachedDb) {
      console.log("Existing cached connection found!");
      return cachedDb;
    }
    console.log("Aquiring new DB connection....");
    try {
      const client = await MongoClient.connect(MONGODB_URI);
      const db = client.db(DB_NAME);
      cachedDb = db;
      return db;
    } catch (error) {
      console.log("ERROR aquiring DB Connection!");
      console.log(error);
      throw error;
    }
  }
};


