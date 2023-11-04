const express = require("express");
const app = express();
const { config } = require("dotenv");

//Importing DB Config File
const mongoConfig = require("./shared/mongo.config");

//Importing Routes
// const studentRoute = require("./routes/student.router");
// const mentorsRoute = require("./routes/mentor.router");
const userRoute = require("./routes/auth.router");

const { maintainance, tokenvalidation } = require("./middleware");

// It is required to Parse our Request body from string to JSON
app.use(express.json());
config();

(async () => {
  try {
    await mongoConfig.connect();
    //Routing
    app.use("/user", userRoute);

    //auth middleware to check token validity
    app.use(maintainance.maintainance);
    app.use(tokenvalidation.tokenValidation);

    // app.use("/students", studentRoute);
    // app.use("/mentors", mentorsRoute);

    app.listen(process.env.PORT, () => {
      console.log(`Listening to PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Errorr In Index js");
  }
})();
