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
const studentsToMentorObject = Joi.object({
  mentor: Joi.string().required(),
  students: Joi.array().required()
});
const mentorToStudentObject = Joi.object({
  student: Joi.string().required(),
  mentor: Joi.string().required()
});

module.exports = { studentObj, mentorObj, studentsToMentorObject, mentorToStudentObject };