const db = require("../mongo");
const { ObjectId } = require("mongodb");

const service = {
  async getUsers(req, res) {
    const data = await db.users.find().toArray();
    res.send(data);
  },
  async getUserFromId(req, res) {
    const userId = req.params.id;
    const data = await db.users.findOne({_id: new ObjectId(userId)});
    res.send(data);
  },
  async newUser(req, res) {
    await db.users.insertOne({ ...req.body });
    res.send({ success: { message: "User added successfully" } });
  },
  async updateUser(req, res) {
    await db.users.updateOne({_id: new ObjectId(req.params.id)}, { $set: { ...req.body } });
    res.send({ success: { message: "User updated successfully" } });
  },
  async deleteUser(req, res) {
    await db.users.deleteOne({_id: new ObjectId(req.params.id)});
    res.send({ success: { message: "User deleted successfully" } });
  }
}

module.exports = service;