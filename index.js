const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./mongo");

const app = express();
const PORT = (process.env.PORT) ? (process.env.PORT) : 3000;

const myService = require("./myService");

(async function load() {
  await db.connect();

  app.use(cors());
  app.use(express.json());
  // app.use((req, res) => { console.log(req.url) });

  app.post("/student/create", (req, res) => myService.createStudent(req, res));
  app.post("/mentor/create", (req, res) => myService.createMentor(req, res))          

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });

}()); //immediately invoked function

