const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");

const app = express();
//Importing DB Config File
const mongoConfig = require("./shared/mongo.config");

//Importing Routes
const playerRoute = require("./routes/player.router");
// const mentorsRoute = require("./routes/mentor.router");
const userRoute = require("./routes/auth.router");

const { maintainance, tokenvalidation } = require("./middleware");

// It is required to Parse our Request body from string to JSON
app.use(express.json());
app.use(cors());
config();

(async () => {
  try {
    await mongoConfig.connect();
    //Routing
    app.use("/admin", userRoute);

    //auth middleware to check token validity
    app.use(maintainance.maintainance);
    //app.use(tokenvalidation.tokenValidation);

    app.use("/player", playerRoute);
    // app.use("/mentors", mentorsRoute);

    app.listen(process.env.PORT, () => {
      console.log(`Listening to PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Errorr In Index js");
  }
})();
