const { MongoClient } = require("mongodb"); 

const client = new MongoClient(process.env.MONGODB_URL);

const mongo = {
  mentors: null,
  students: null,
  db: null,
  async connect() {
    await client.connect();
    this.db = client.db(process.env.MONGODB_NAME);
    console.log("Mongo DB connected");

    this.mentors = db.collection("mentors");
    this.students = db.collection("students");
  }
}

module.exports = mongo;