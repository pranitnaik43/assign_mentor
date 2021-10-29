const db = require("../mongo");
const { ObjectId } = require("bson");
const { mentorObj, studentsToMentorObject } = require('../Validations');
const studentServices = require('./student.services');

const service = {
  async getAllMentors(req, res) {
    const data = await db.mentors.find().toArray();
    res.send(data);
  },
  async getStudentsForMentor(req, res) {
    const mentorId = req.body.mentor;
    const mentor = await db.mentors.findOne({ _id: new ObjectId(mentorId) });
    if(!mentor) { 
      return res.send({ error: { message: "Mentor does not exists" }});
    }
    let students = [];
    for (let studentId of mentor.students) {
      var student = await studentServices.getStudentFromId(studentId);
      students.push(student);
    }
    // console.log(students);
    res.send(students);
  },
  async createMentor(req, res) {
    //Validate request body 
    const { error } = await mentorObj.validate(req.body);
    if(error) { return res.send({ error: { message: error.details[0].message }}); }

    let dataFromEmail = await db.mentors.findOne({ email: req.body.email });
    if(dataFromEmail) return res.send({ error: { message: "Email already exists" }});

    let dataFromPhone = await db.mentors.findOne({ phone: req.body.phone });
    if(dataFromPhone) return res.send({ error: { message: "Phone number already exists" }});

    await db.mentors.insertOne(req.body);
    res.send({ success: { message: "Mentor details added successfully" }});
  },
  async assignStudentsToMentor(req, res) {
    //validate request body
    const { error } = studentsToMentorObject.validate(req.body);
    if (error) { return res.send({error: { message: error.details[0].message }}); }
    const mentor_id = new ObjectId(req.body.mentor);
    const student_ids = req.body.students;

    //assign mentor to each student
    for (const id of student_ids) {
      var result = await studentServices.studentMentorAssignment(new ObjectId(id), mentor_id);
      if(result.error) { return res.send(result); }
    }

    res.send({success: { message: "Students assigned successfully"}});
  }
}

module.exports =  service;