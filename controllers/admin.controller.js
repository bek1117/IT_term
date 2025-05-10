const Admin = require("../schemas/admin");
const error_handler = require("../utils/send.error.response");
const {
  adminCreateSchema,
  adminUpdateSchema,
} = require("../validation/admin.validation");
const JWT = require("jsonwebtoken");
const config = require("config");
const key = config.get("JWTadmin");
const bcrypt = require("bcrypt");
const JWTexp = config.get("JWTexp") || "1h";

exports.createAdmin = async (req, res) => {
  try {
    const { error, value } = adminCreateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const admin = new Admin({
      ...value,
      password: bcrypt.hashSync(value.password, 10),
    });
    await admin.save();
    res.status(201).json(admin);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { error } = adminUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    error_handler(err, res);
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ message: "Admin deleted" });
  } catch (err) {
    error_handler(err, res);
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const payload = {
      id: admin.id,
      email: admin.email,
      isActive: admin.is_active,
      isExpert: admin.is_expert,
    };
    const token = JWT.sign(payload, key, { expiresIn: JWTexp });
    res
      .status(200)
      .json({ message: "Login successful", data: admin.id, token });
  } catch (error) {
    error_handler(error, res);
  }
};