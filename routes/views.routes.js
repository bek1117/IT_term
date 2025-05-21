const router = require("express").Router();
const view_gen = require("../utils/create-view-page");

const pages = [
  { path: "/", view: "index", title: "Home", isHome: true },
  {
    path: "/dictionary",
    view: "dictionary",
    title: "Dictionary",
    isDict: true,
  },
  { path: "/topic", view: "topics", title: "Topics", isTopic: true },
  { path: "/author", view: "authors", title: "Authors", isAuthor: true },
  { path: "/login", view: "login", title: "Login", isLogin: true },
  { path: "/register", view: "register", title: "Register", isRegister: true },
];

pages.forEach(({ path, view, title, ...rest }) => {
  router.get(path, (_, res) => {
    res.render(view_gen(view), { title, ...rest });
  });
});

module.exports = router;
