const jwt = require("jsonwebtoken");
const config = require("config");

class JWTService {
  constructor({ access, refresh, access_time, refresh_time }) {
    this.access_key = access;
    this.refresh_key = refresh;
    this.access_time = access_time;
    this.refresh_time = refresh_time;
  }

  generate_tokens(payload) {
    const acces_token = jwt.sign(payload, this.access_key, {
      expiresIn: this.access_time,
    });
    const refresh_token = jwt.sign(payload, this.refresh_key, {
      expiresIn: this.refresh_time,
    });
    return { acces_token, refresh_token };
  }
  async verify_acces(token) {
    return jwt.verify(token, this.access_key);
  }
  async verify_refresh(token) {
    return jwt.verify(token, this.refresh_key);
  }
}

const Admin = new JWTService(config.get("admin"));
const User = new JWTService(config.get("user"));
const Author = new JWTService(config.get("author"));

module.exports = { Admin, User, Author };
