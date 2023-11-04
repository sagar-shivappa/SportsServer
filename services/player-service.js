const { validate, playerSchema } = require("../shared/schema");
const dbConfig = require("../shared/mongo.config");
module.exports = {
  async registerPlayer(req, res) {
    try {
      // validate the data
      const isError = await validate(playerSchema, req.body);
      if (isError) return res.json({ message: isError });
      const playerID = await generatePlayerID(req.body);

      const player = await dbConfig
        .collectionConnection("Players")
        .findOne({ fullName: req.body.fullName });

      if (player) {
        res.status(400).send({
          message: `${req.body.fullName} has already Registered`,
          status: "Rejected",
        });
      } else {
        req.body.playerID = playerID;
        await dbConfig.collectionConnection("Players").insertOne(req.body);
        res.status(200).send({
          message: `Registered ${req.body.fullName}`,
          playerID: playerID,
          status: "Success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async playerDetails(req, res) {
    try {
      const player = await dbConfig
        .collectionConnection("Players")
        .findOne({ playerID: req.params.playerID });

      res.status(200).send(player);
    } catch (error) {
      console.log(error);
    }
  },
};

async function generatePlayerID(req) {
  const random = Math.floor(Math.random() * 100 + 1);
  const category = await getPlayerCategory(req.age, req.gender);
  const playerID = `${category}-${req.fullName.slice(0, 2)}${random}`;
  return playerID;
}

function getPlayerCategory(age, gender) {
  if (age <= 8) return "K";

  if (age > 9 && age <= 12) return "C";
  if (age > 12 && age <= 18) return "T";
  if (age > 18 && age <= 39) return gender == "Male" ? "YM" : "YF";
  if (age > 39 && age <= 59) return gender == "Male" ? "WM" : "WF";
  if (age >= 60) return gender == "Male" ? "LM" : "LF";
  else {
    return "UN";
  }
}
