const route = require("express").Router();

const { signUp, signIn } = require("../services/auth-service");

route.post("/register", signUp);

route.post("/login", signIn);

module.exports = route;
