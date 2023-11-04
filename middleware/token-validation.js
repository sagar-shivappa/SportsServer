const jwt = require("jsonwebtoken");

const tokenValidation = (req, res, next) => {
  if (req?.headers && req.headers?.authorization) {
    const [tokenType, Token] = req.headers.authorization.split(" ");
    if (tokenType === "Bearer") {
      jwt.verify(Token, process.env.JWT_SECRET || "secretkey", (err, data) => {
        if (err) {
          res.status(400).json({ message: "Invalid Token" });
        } else {
          req.user = data?._id.email;

          next();
        }
      });
    } else {
      res.status(400).json({ message: "Invalid Token Type" });
    }
  } else {
    res.status(400).json({ message: "No token found" });
  }
};
module.exports = { tokenValidation };
