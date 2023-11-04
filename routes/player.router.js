const route = require("express").Router();

const { registerPlayer, playerDetails } = require("../services/player-service");

route.post("/register", registerPlayer);

route.get("/:playerID", playerDetails);

module.exports = route;
