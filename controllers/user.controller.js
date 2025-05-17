const {
  userCreateSchema,
  userUpdateSchema,
} = require("../validation/user.validation");
const User = require("../schemas/user");
const bcrypt = require("bcrypt");
const config = require("config");
const error_handler = require("../utils/send.error.response");
const { UserJWTService } = require("../services/jwt.service");
const Refresh = require("../schemas/refresh");
const { v4 } = require("uuid");
const mailService = require("../services/mail.service");

exports.createUser = async (req, res) => {
  try {
    const { error, value } = userCreateSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    value.password = await bcrypt.hash(value.password, 10);
    const user = new User(value);
    user.activation_link = v4();
    await mailService.sendMail(user.email, user.activation_link);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
    }

    const user = await User.findByIdAndUpdate(value.id, value, { new: true });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ message: "User deleted" });
  } catch (err) {
    error_handler(err, res);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Invalid email or password" });

    const payload = {
      id: user.id,
      email: user.email,
      isActive: user.is_active,
      isCreator: user.is_creator,
    };

    const { refresh_token, access_token } =
      UserJWTService.generate_tokens(payload);

    await Refresh.create({
      token: refresh_token,
      role: "user",
      expiresAt: new Date(Date.now() + config.get("user.refresh_time")),
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res
      .status(200)
      .send({ message: "Login successful", data: payload.id, access_token });
  } catch (err) {
    error_handler(err, res);
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token)
      return res.status(401).send({ message: "Unauthorized" });

    await Refresh.deleteOne({ token: refresh_token });

    res.clearCookie("refresh_token");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    error_handler(error, res);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token)
      return res.status(401).send({ message: "Unauthorized" });

    const tokenDoc = await Refresh.findOne({ token: refresh_token });
    if (!tokenDoc)
      return res
        .status(403)
        .send({ message: "Refresh token not found or expired" });

    const decoded = UserJWTService.verify_refresh(refresh_token);
    if (!decoded)
      return res.status(403).send({ message: "Invalid refresh token" });

    const payload = {
      id: decoded.id,
      email: decoded.email,
      isActive: decoded.isActive,
      isCreator: decoded.isCreator,
    };

    const { refresh_token: new_refresh_token, access_token } =
      UserJWTService.generate_tokens(payload);

    tokenDoc.token = new_refresh_token;
    tokenDoc.expiresAt = new Date(Date.now() + config.get("user.refresh_time"));
    await tokenDoc.save();

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(200).send({
      message: "Token refreshed successfully",
      access_token,
    });
  } catch (error) {
    error_handler(error, res);
  }
};

exports.ActivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ activation_link: id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.is_active = true;
    await user.save();
    res
      .status(200)
      .send({ message: "Your account has been activated successfully" });
  } catch (error) {
    error_handler(error, res);
  }
};

exports.AdminRefreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(401).send({ message: "Refresh token not provided" });
    }

    const decoded = await UserJWTService.verify_refresh(refresh_token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const existingToken = await Refresh.findOne({ token: refresh_token });
    if (!existingToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const { acces_token, refresh_token: new_refresh_token } =
      UserJWTService.generate_tokens({
        id: user.id,
        email: user.email,
        isActive: user.is_active,
        isExpert: user.is_expert,
      });

    await Refresh.findOneAndUpdate(
      { token: refresh_token },
      {
        token: new_refresh_token,
        expiresAt: new Date(Date.now() + config.get("user.refresh_time")),
      }
    );

    res.cookie("refresh_token", new_refresh_token, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Token refreshed successfully",
      data: user.id,
      access_token: acces_token,
    });
  } catch (error) {
    error_handler(error, res);
  }
};
