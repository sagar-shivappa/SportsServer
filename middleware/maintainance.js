const maintainance = (_, res, next) => {
  if (process.env.MAINTAINANCE == "true") {
    res.json({ message: "Site is under maintainance" });
  } else {
    next();
  }
};

module.exports = { maintainance };
