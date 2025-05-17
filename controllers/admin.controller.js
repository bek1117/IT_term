const Admin = require("../schemas/admin");
const Token = require("../schemas/refresh");
const error_handler = require("../utils/send.error.response");
const {
  adminCreateSchema,
  adminUpdateSchema,
} = require("../validation/admin.validation");
const config = require("config");
const bcrypt = require("bcrypt");
const { AdminJWTService } = require("../services/jwt.service");
const Joi = require("joi");
const { v4 } = require("uuid");
const mailService = require("../services/mail.service");

exports.createAdmin = async (req, res) => {
  try {
    const { error, value } = adminCreateSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const hashedPassword = bcrypt.hashSync(value.password, 10);

    const activation_link = v4();

    const admin = new Admin({
      ...value,
      password: hashedPassword,
      activation_link,
    });

    await admin.save();

    res.status(201).send({
      messege:
        "Admin created successfully, Please activate your account via link that send to your email",
    });

    mailService.sendMail(admin.email, activation_link);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).send(admins);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).send({ message: "Admin not found" });
    res.status(200).send(admin);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { error } = adminUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!admin) return res.status(404).send({ message: "Admin not found" });
    res.status(200).send(admin);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).send({ message: "Admin not found" });
    res.status(200).send({ message: "Admin deleted" });
  } catch (err) {
    error_handler(err, res);
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).send({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Invalid email or password" });

    const payload = {
      id: admin.id,
      email: admin.email,
      isActive: admin.is_active,
      isExpert: admin.is_expert,
    };

    const { refresh_token, access_token } =
      AdminJWTService.generate_tokens(payload);

    await Token.create({
      token: refresh_token,
      role: "admin",
      expiresAt: new Date(Date.now() + config.get("admin.refresh_time")),
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(200).send({
      message: "Login successful",
      data: payload.id,
      access_token,
    });
  } catch (error) {
    error_handler(error, res);
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    await Token.deleteOne({ token: refresh_token });

    res.clearCookie("refresh_token");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    error_handler(error, res);
  }
};

exports.ActivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({ activation_link: id });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    admin.is_active = true;
    await admin.save();
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

    const decoded = await AdminJWTService.verify_refresh(refresh_token);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const existingToken = await Refresh.findOne({ token: refresh_token });
    if (!existingToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const { acces_token, refresh_token: new_refresh_token } =
      AdminJWTService.generate_tokens({
        id: admin.id,
        email: admin.email,
        isActive: admin.is_active,
        isExpert: admin.is_expert,
      });

    await Refresh.findOneAndUpdate(
      { token: refresh_token },
      {
        token: new_refresh_token,
        expiresAt: new Date(Date.now() + config.get("admin.refresh_time")),
      }
    );

    res.cookie("refresh_token", new_refresh_token, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Token refreshed successfully",
      data: admin.id,
      access_token: acces_token,
    });
  } catch (error) {
    error_handler(error, res);
  }
};
