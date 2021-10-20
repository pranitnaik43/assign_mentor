const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./mongo");

const app = express();
const PORT = (process.env.PORT) ? (process.env.PORT) : 3000;

const studentServices = require("./Services/student.services");
const mentorServices = require("./Services/mentor.services");
const userServices = require("./Services/user.services");

(async function load() {
  await db.connect();

  app.use(cors());
  app.use(express.json());

  //student routes
  app.get("/student/all", (req, res) => studentServices.getAllStudents(req, res));
  app.get("/student/having_no_mentor", (req, res) => studentServices.getStudentsWithNoMentor(req, res));
  app.post("/student/create", (req, res) => studentServices.createStudent(req, res));
  app.post("/student/assignMentor", (req, res) => studentServices.assignMentorToStudent(req, res));
  
  //mentor routes
  app.get("/mentor/all", (req, res) => mentorServices.getAllMentors(req, res));
  app.get("/mentor/getStudents", (req, res) => mentorServices.getStudentsForMentor(req, res));
  app.post("/mentor/create", (req, res) => mentorServices.createMentor(req, res));
  app.post("/mentor/assignStudents", (req, res) => mentorServices.assignStudentsToMentor(req, res));   
  
  //user routes
  app.get("/users", (req, res) => mentorServices.getAllMentors(req, res));
  app.post("/users");
  app.put("/users/:id");
  app.get("/profile/:userId");
  app.post("profile/:userId");
  app.put("profile/:userId");


  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });

}()); //immediately invoked function

