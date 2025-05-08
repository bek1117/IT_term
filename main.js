const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const Routes = require("./routes/index.routes");

const PORT = config.get("PORT") || 3030;

const app = express();

app.use(express.json());
app.use("/api", Routes);

async function start() {
  try {
    const uri = config.get("uri");
    await mongoose.connect(uri);
    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
}

start();
