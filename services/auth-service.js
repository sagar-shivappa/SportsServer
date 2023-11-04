const dbConfig = require("../shared/mongo.config");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { validate, signUpSchema, loginSchema } = require("../shared/schema");

module.exports = {
  async signUp(req, res) {
    try {
      // validate the data
      const isError = await validate(signUpSchema, req.body);
      if (isError) return res.json({ message: isError });

      const data = await dbConfig
        .collectionConnection("Players")
        .findOne({ phoneNumber: req.body.phoneNumber });
      if (data) {
        res.send({ message: "Player exists" });
      } else {
        if (req.body.password != req.body.cPassword) {
          res.send({ message: "Password Mismatch" });
        } else {
          delete req.body.cPassword;

          // encrypt the password before inserted
          const salt = await bcrypt.genSalt(5);
          req.body.password = await bcrypt.hash(req.body.password, salt);

          await dbConfig.collectionConnection("Players").insertOne(req.body);
          res.send({ message: "Player added successfully" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  async signIn(req, res) {
    try {
      // create joi schema with name
      //Pulling the schema from scehma.js

      // validate the data
      const isError = await validate(loginSchema, req.body);
      if (isError) return res.json({ message: isError });

      const user = await dbConfig
        .collectionConnection("Players")
        .findOne({ phoneNumber: req.body.phoneNumber });
      if (user) {
        //comparing the encrypted password in db with the input password
        const isValidPass = await bcrypt.compare(
          req.body.password,
          user.password
        );

        //creating the token
        delete user.password;
        const authToken = jwt.sign({ _id: user }, "secretkey", {
          expiresIn: process.env.TOKEN_EXPIRES_IN,
        });

        isValidPass
          ? res.status(200).json({ message: "Sucess login", authToken })
          : res.status(200).json({ message: "Invalid UserName & password" });
      } else {
        res.status(400).json({ message: "Player doesn't exists" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
