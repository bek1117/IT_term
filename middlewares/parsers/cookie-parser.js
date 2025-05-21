const customCookieParser = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};

  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    cookies.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      req.cookies[key] = decodeURIComponent(value);
    });
  }

  next();
};

const jsonParser = (req, res, next) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }
  const contentType = req.headers["content-type"];

  if (!contentType || !contentType.includes("application/json")) {
    return next();
  }

  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    try {
      req.body = JSON.parse(data);
      next();
    } catch (err) {
      res.status(400).json({ error: "Invalid JSON format" });
    }
  });

  req.on("error", () => {
    res.status(400).json({ error: "Error reading request body" });
  });
};

module.exports = { customCookieParser, jsonParser };