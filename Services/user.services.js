const db = require("../mongo");
const { ObjectId } = require("mongodb");

const users = db.collections("users");
const service = {
  async getUsers(req, res) {
    const data = await users.find().toArray();
    res.send(data);
  },
  async getUserFromId(req, res) {
    const userId = req.params.id;
    const data = await users.findOne({_id: new ObjectId(userId)});
    res.send(data);
  },
  async newUser(req, res) {
    await users.insertOne({ ...req.body });
    res.send({ success: { message: "User added successfully" } });
  },
  async updateUser(req, res) {
    await db.users.updateOne({_id: req.params.id}, { $set: { ...req.body } });
    res.send({ success: { message: "User updated successfully" } });
  },
  async deleteUser(req, res) {
    await db.users.remove({_id: req.params.id});
    res.send({ success: { message: "User deleted successfully" } });
  }
}

module.exports = service;