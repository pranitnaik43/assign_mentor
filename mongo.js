const { MongoClient } = require("mongodb"); 

const client = new MongoClient(process.env.MONGODB_URL);

const mongo = {
  mentors: null,
  students: null,
  async connect() {
    await client.connect();
    const db = client.db(process.env.MONGODB_NAME);
    console.log("Mongo DB connected");

    this.mentors = db.collection("mentors");
    this.students = db.collection("students");
  }
}

module.exports = mongo;