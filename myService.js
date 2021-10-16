const db = require("./mongo");
const Joi = require("joi");

//structure for validating student data
const studentObj = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  gender: Joi.string(),
  age: Joi.number(),
  batch: Joi.string()
});
//structure for validating mentor data
const mentorObj = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  gender: Joi.string(),
  age: Joi.number(),
  specialization: Joi.array().required()
});

const service = {
  async createStudent(req, res) {
    // Validate Request Body
    const {error} = await studentObj.validate(req.body);
    if(error) { return res.send({ error: { message: error.details[0].message }}); }

    let dataFromEmail = await db.students.findOne({ email: req.body.email });
    if(dataFromEmail) return res.send({ error: { message: "Email already exists" }});

    let dataFromPhone = await db.students.findOne({ phone: req.body.phone });
    if(dataFromPhone) return res.send({ error: { message: "Phone number already exists" }});

    await db.students.insertOne(req.body);
    res.send({ success: { message: "Student details added successfully" }});
  },
  async createMentor(req, res) {
    //Validate request body
    const { error } = await mentorObj.validate(req.body);
    if(error) { return res.send({ error: { message: error.details[0].message }}); }

    let dataFromEmail = await db.mentor.findOne({ email: req.body.email });
    if(dataFromEmail) return res.send({ error: { message: "Email already exists" }});

    let dataFromPhone = await db.mentor.findOne({ phone: req.body.phone });
    if(dataFromPhone) return res.send({ error: { message: "Phone number already exists" }});

    await db.users.insertOne(req.body);
    res.send({ success: { message: "Mentor details added successfully" }});
  }
}

module.exports =  service;