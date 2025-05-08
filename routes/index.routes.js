const dictRoutes = require("./dict.routes");
const CategoryRoutes = require("./category.routes");
const AuthorRoutes = require("./author.routes");
const descRoutes = require("./description.routes");
const SynonymRoute = require("./sysnonym.routes");
const TopicRoute = require("./topic.routes");
const TagRoute = require("./tag.routes")
const index = require("express").Router();

index.use("/dict", dictRoutes);
index.use("/category", CategoryRoutes);
index.use("/author", AuthorRoutes);
index.use("/description", descRoutes);
index.use("/synonym", SynonymRoute);
index.use("/topic", TopicRoute);
index.use("/tag", TagRoute);

module.exports = index;
