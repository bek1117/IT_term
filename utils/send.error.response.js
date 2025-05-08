const send_error = (err, res) => {
  console.log(err);
  res.status(400).send({ error: err });
};

module.exports = send_error;