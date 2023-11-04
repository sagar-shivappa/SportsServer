const joi = require("joi");

module.exports = {
  async validate(schema, body) {
    try {
      await schema.validateAsync(body);
      return false;
    } catch ({ details: [err] }) {
      return err.message;
    }
  },
  signUpSchema: joi.object({
    name: joi.string().min(3).max(20).required(),
    age: joi.number().min(18).required(),
    email: joi.string().email(),
    password: joi.string().required(),
    phoneNumber: joi.number().required(),
    cPassword: joi.ref("password"),
    category: joi.string().required(),
  }),
  loginSchema: joi.object({
    phoneNumber: joi.number().required(),
    password: joi.string().required(),
  }),
  gameSchema: joi.object({
    gameId: joi.string().required(),
    gameName: joi.string().required(),
    owner: joi.array(),
    rules: joi.array(),
    category: joi.string().required(),
    gameStatus: joi.string().required(),
  }),
};
