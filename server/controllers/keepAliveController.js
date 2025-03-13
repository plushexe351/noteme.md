const keepAlive = (req, res) => {
  res.status(200).send("Server is alive");
};

module.exports = { keepAlive };
