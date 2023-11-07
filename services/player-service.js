const { validate, playerSchema } = require("../shared/schema");
const dbConfig = require("../shared/mongo.config");
module.exports = {
  async registerPlayer(req, res) {
    try {
      // validate the data
      const isError = await validate(playerSchema, req.body);
      if (isError) return res.json({ message: isError });

      const player = await dbConfig.collectionConnection("Players").findOne({
        fullName: req.body.fullName,
        contactNumber: req.body.contactNumber,
        age: req.body.age,
      });

      if (player) {
        res.status(400).send({
          message: `${req.body.fullName} has already been Registered`,
          playerID: player.playerID,
          status: "Rejected",
        });
      } else {
        const playerID = await generatePlayerID(req.body);

        const Id = playerID[1].toUpperCase();
        const category = playerID[0];

        req.body.playerID = Id;
        req.body.category = category;
        await dbConfig.collectionConnection("Players").insertOne(req.body);
        res.status(200).send({
          message: `Congratulations! ${req.body.fullName.toUpperCase()} for successfully registering to ದೇವಾಂಗ ಕ್ರೀಡೋತ್ಸವ 2023`,
          playerID: Id,
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
        .findOne({ playerID: req.params.playerID.toUpperCase() });
      player
        ? res.status(200).send(player)
        : res.status(400).send({ message: "Invalid Player ID, please check" });
    } catch (error) {
      console.log(error);
    }
  },
};

async function generatePlayerID(req) {
  const random = Math.floor(Math.random() * 100 + 1);
  const category = await getPlayerCategory(req.age, req.gender);
  const playerID = [category, `${req.fullName.slice(0, 2)}${random}`];
  return playerID;
}

function getPlayerCategory(age, gender) {
  if (age <= 8) return "Kids";

  if (age > 9 && age <= 12) return "Children";
  if (age > 12 && age <= 18) return "Teens";
  if (age > 18 && age <= 39)
    return gender == "Male" ? "Youngster Male" : "Youngster Female";
  if (age > 39 && age <= 59)
    return gender == "Male" ? "Warrior Male " : "Warrior Female";
  if (age >= 60) return gender == "Male" ? "Legends Male" : "Legends Female";
  else {
    return "UN";
  }
}
