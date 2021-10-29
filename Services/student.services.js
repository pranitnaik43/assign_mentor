const db = require("../mongo");
const { ObjectId } = require("mongodb");
const { studentObj, mentorToStudentObject } = require('../Validations');

const service = {
  async getAllStudents(req, res) {
    const data = await db.students.find().toArray();
    res.send(data);
  },
  async getStudentFromId(studentId) {
    var student = await db.students.findOne({ _id: new ObjectId(studentId) });
    return student;
  },
  async getStudentsWithNoMentor(req, res) {
    const students = await db.students.find().toArray();
    const studentsWithNoMentor = students.filter(student => {
      if(student.mentor===null || student.mentor===undefined) return true;
      else return false;
    });
    res.send(studentsWithNoMentor);
  },
  async studentMentorAssignment(studentId, mentorId) {
    //get the student data
    let student = await db.students.findOne({_id: new ObjectId(studentId)});

    //check if student exists
    if(!student) { 
      let error = { error: { message: "Student does not exists" }};
      console.log(error);
      return error;
    }

    //check if student already has a mentor
    const oldMentorId = student.mentor;
    if(oldMentorId) {
      const oldMentor = await db.mentors.findOne({_id: oldMentorId});

      // remove the student from the old mentor's list
      if(oldMentor.students) {
        oldMentor.students = oldMentor.students.filter(id => (id.toHexString()!==studentId.toHexString() ));
        // console.log(oldMentor);
        //update the old mentor's data
        await db.mentors.updateOne({_id: oldMentor.id}, {$set: { ...oldMentor } });
      }
    }
    // get new mentor data
    const newMentor = db.mentors.findOne({_id: mentorId});

    //check if mentor exists
    if(!newMentor) { 
      let error = { error: { message: "Mentor does not exists" }};
      console.log(error);
      return error;
    }

    if(!newMentor.students) newMentor.students = [];

    //add student to the new mentor's list
    if(!newMentor.students.includes(studentId)) newMentor.students.push(studentId);

    //update mentor
    await db.mentors.updateOne({_id: mentorId}, {$set: {...newMentor} });

    //assign mentor to student
    student.mentor = mentorId;

    //update student
    await db.students.updateOne({_id: studentId}, {$set: { ...student } });

    return { success: "Successful" };
  },
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
  async assignMentorToStudent(req, res) {
    //validate request body
    const { error } = mentorToStudentObject.validate(req.body);
    if (error) { return res.send({error: { message: error.details[0].message }}); }

    let student_id = new ObjectId(req.body.student);
    let mentor_id = new ObjectId(req.body.mentor);
    
    //assign mentor to student
    let result =  await this.studentMentorAssignment(student_id, mentor_id);
    if(result.error) { return res.send(result); }

    res.send({ success: { message: "Mentor assigned successfully" } });
  }
}

module.exports =  service;