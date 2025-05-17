const Author = require("../schemas/author");
const mongoose = require("mongoose");
const error_handler = require("../utils/send.error.response");
const { authorValidation } = require("../validation/author.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const Refresh = require("../schemas/refresh");
const {AuthorJWTService} = require("../services/jwt.service");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    if (!authors.length) {
      return res.status(404).send({ message: "Authors not found" });
    }
    res.status(200).send({ data: authors });
  } catch (error) {
    error_handler(error, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res.status(200).send({ data: author });
  } catch (error) {
    error_handler(error, res);
  }
};

const createAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return error_handler(error, res);
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const link = uuid.v4();
    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
      activation_link: link,
    });
    await mailService.sendMail(newAuthor.email, link);
    res.status(201).send({
      message:
        "Author created successfully, Please check your email to activate your account"
    });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    const author = await Author.findByIdAndUpdate(id, data, { new: true });
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res
      .status(200)
      .send({ message: "Author updated successfully", data: author });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res
      .status(200)
      .send({ message: "Author deleted successfully", data: author });
  } catch (error) {
    error_handler(error, res);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isPasswordValid = bcrypt.compareSync(password, author.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const payload = {
      id: author.id,
      email: author.email,
      isActive: author.is_active,
      isExpert: author.is_expert,
    };

    const { acces_token, refresh_token } = AuthorJWTService.generate_tokens(payload);

    await Refresh.create({
      token: refresh_token,
      role: "author",
      expiresAt: new Date(Date.now() + config.get("author.refresh_time")),
    });

    res.cookie("refresh_token", refresh_token, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Login successful",
      data: author.id,
      access_token: acces_token,
    });
  } catch (error) {
    error_handler(error, res);
  }
};

const AuthorLogout = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(400).send({ message: "No refresh token provided" });
    }

    const token = await Refresh.findOneAndUpdate(
      { token: refresh_token },
      { isExpired: true }
    );

    if (!token) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    res.clearCookie("refresh_token");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    error_handler(error, res);
  }
};

const AuthorRefreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(401).send({ message: "Refresh token not provided" });
    }

    const decoded = await AuthorJWTService.verify_refresh(refresh_token);

    const author = await Author.findById(decoded.id);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }

    const existingToken = await Refresh.findOne({ token: refresh_token });
    if (!existingToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const { acces_token, refresh_token: new_refresh_token } =
      AuthorJWTService.generate_tokens({
        id: author.id,
        email: author.email,
        isActive: author.is_active,
        isExpert: author.is_expert,
      });

    await Refresh.findOneAndUpdate(
      { token: refresh_token },
      {
        token: new_refresh_token,
        expiresAt: new Date(
          Date.now() + config.get("author.refresh_time")
        ),
      }
    );

    res.cookie("refresh_token", new_refresh_token, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Token refreshed successfully",
      data: author.id,
      access_token: acces_token,
    });
  } catch (error) {
    error_handler(error, res);
  }
};

const ActivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Author.findOne({ activation_link: id });
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

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  AuthorLogout,
  AuthorRefreshToken,
  ActivateUser,
};
