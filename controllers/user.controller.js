const {
  userCreateSchema,
  userUpdateSchema,
} = require("../validation/user.validation");
const User = require("../schemas/user");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const config = require("config");
const key = config.get("JWTuser");
const JWTexp = config.get("JWTexp") || "1h";
const error_handler = require("../utils/send.error.response");

exports.createUser = async (req, res) => {
  try {
    const { error, value } = userCreateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    value.password = await bcrypt.hash(value.password, 10);

    const user = new User(value);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    if (value.password) {
      value.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(value.id, value);

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    error_handler(err, res);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = {
      id: user.id,
      email: user.email,
      isActive: user.is_active,
      isCreator: user.is_creator,
    };
    const token = JWT.sign(payload, key, { expiresIn: JWTexp });
    res.status(200).json({ message: "Login successful", data: user.id, token });
  } catch (err) {
    error_handler(err, res);
  }
};
