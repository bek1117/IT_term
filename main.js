const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const Routes = require("./routes/index.routes");
const cookieParser = require("cookie-parser");
const errorHandlingMiddleware = require("./middlewares/errors/error-handling.middleware");
const requestErrorLogger = require("./middlewares/loggers/requestError.logger");
const requestLogger = require("./middlewares/loggers/request.logger");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const PORT = config.get("PORT") || 3030;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use("/api", Routes);

app.use(requestErrorLogger);

app.use(errorHandlingMiddleware);

async function start() {
  try {
    const uri = config.get("uri");
    await mongoose.connect(uri);
    app.listen(PORT, () =>
      console.log(
        `Server started on port http://localhost:${PORT}\nPress CTRL + C to stop the process`
      )
    );
  } catch (error) {
    console.log(error);
  }
}

start();