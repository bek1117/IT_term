const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const Routes = require("./routes/index.routes");
const errorHandlingMiddleware = require("./middlewares/errors/error-handling.middleware");
const requestErrorLogger = require("./middlewares/loggers/requestError.logger");
const requestLogger = require("./middlewares/loggers/request.logger");
const exHandlebars = require("express-handlebars");
const ViewRouter = require("./routes/views.routes");

const {
  jsonParser,
  customCookieParser
} = require("./middlewares/parsers/cookie-parser");


const PORT = config.get("PORT") || 3030;

const app = express();

app.use(jsonParser);
app.use(customCookieParser);

const handlebars = exHandlebars.create({
  defaultLayout: "main",
  extname: ".hbs",
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("views"));

// app.use(requestLogger);

app.use("/", ViewRouter);
app.use("/api", Routes);

// app.use(requestErrorLogger);

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
