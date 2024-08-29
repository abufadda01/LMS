const bcrypt = require("bcrypt");
const Joi = require("joi");
const crypto = require("crypto");

const ROLES = require("../utils/roles");

const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Parent = require("../models/parentModel");
const Instructor = require("../models/instructorModel");

const createError = require("../utils/createError");
const sendEmail = require("../utils/sendEmail");

const jwt = require("jsonwebtoken");


const register = async (req, res, next) => {

  const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    age: Joi.number().integer().min(1).required(),
    role: Joi.string().valid("student", "instructor", "admin").required(),
    parentName: Joi.string().when("role", {
      is: "student",
      then: Joi.required(),
    }),
    parentEmail: Joi.string()
      .email()
      .when("role", { is: "student", then: Joi.required() }),
    parentAge: Joi.number()
      .integer()
      .min(1)
      .when("role", { is: "student", then: Joi.required() }),
  });


  const { value, error } = signUpSchema.validate(req.body, {
    abortEarly: false,
  });


  if (error) {
    return next(createError("Invalid Credentials", 500));
  }


  try {

    const { name, email, password, age, role, parentName, parentEmail, parentAge } = value;

    if (!name || !email || !password || !age || !role) {
      return next(createError("Invalid Credentials", 400));
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return next(createError("User already exists", 400));
    }

    if (role === "student") {

      if (!parentEmail || !parentName) {
        return next(createError("Parent email and name are required for student registration", 400));
      }

      let parentUser;

      if (parentEmail) {

        // Check if parent already exists
        parentUser = await User.findOne({ email: parentEmail });

        // If parent doesn't exist, create a new one
        if (!parentUser) {

          const parent = new User({
            name: parentName,
            email: parentEmail,
            role: "parent",
            age: parentAge,
            password,
          });

          await parent.save();

          parentUser = parent;

        }
      }

      // Create user object for the student
      user = new User({
        name,
        email,
        password,
        age,
        role,
        parentId: parentUser._id,
      });

      await user.save();

      // Create parent document if parent user is present
      let parentDoc = null;

      if (parentUser) {

        parentDoc = await Parent.findOne({ userObjRef: parentUser._id });

        if (!parentDoc) {
          parentDoc = new Parent({
            name: parentName,
            email: parentEmail,
            userObjRef: parentUser._id,
          });

          await parentDoc.save();
        }
      }

      // Create student document
      const student = new Student({
        name,
        age,
        userObjRef: user._id,
        parentId: parentDoc ? parentDoc._id : null,
      });

      if (parentDoc) {
        parentDoc.studentsEnrolled.push(student._id);
        await parentDoc.save();
      }

      await student.save();

    } else if (role === "instructor" || role === "admin") {

      if (role === "instructor" && age < 25) {
        return next(createError("Instructors must be at least 25 years old", 400));
      } 

      // Create user object for the instructor or admin
      user = new User({ name, email, password, age, role });
      
      if(role === "admin"){
        user.isAdmin = true
        user.isInstructor = true
      }

      if(role === "instructor"){
        user.isInstructor = true
      }

      await user.save();

      // Create instructor document
      const instructor = new Instructor({
        name,
        email,
        userObjRef: user._id,
      });

      await instructor.save();

    } else {
      return next(createError("Invalid role specified", 400));
    }

    res.status(201).json(user);

  } catch (error) {
    next(error);
  }
};





const login = async (req, res, next) => {
  
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { value, error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError("Inavlid Credentials", 500));
  }

  try {

    const { email, password } = value;

    if (!email || !password) {
      return next(createError("Email and password are required", 400));
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(createError("Invalid Credentials", 400));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(createError("Invalid Credentials", 400));
    }

    user.password = undefined;

    // Generate JWT token
    const token = user.signJWT();

    // Respond with user details and token
    res.status(200).json({
      user,
      token,
    });

  } catch (error) {
    next(error);
  }
};





const updateProfile = async (req, res, next) => {
  
  const updateProfileSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    age: Joi.number().integer().min(1).optional(),
    parentName: Joi.string().optional(),
    parentEmail: Joi.string().email().optional(),
    parentAge: Joi.number().integer().min(1).optional(),
  });

  const { value, error } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(createError("Invalid Credentials", 400));
  }

  try {
    const userId = req.user._id;

    const { name, email, password, age, parentName, parentEmail, parentAge } =
      value;

    const user = await User.findById(userId);

    if (!user) {
      return next(createError("User not found", 404));
    }

    if (req.user._id.toString() !== user._id.toString()) {
      return next(createError("you don't have access to update profile", 401));
    }

    if (name) user.name = name;

    if (email) user.email = email;

    if (password) user.password = await bcrypt.hash(password, 10);

    if (age) user.age = age;

    await user.save();

    if (user.role === ROLES.STUDENT) {
      const student = await Student.findOne({ userObjRef: userId });

      if (!student) {
        return next(createError("Student profile not found", 404));
      }

      if (name) student.name = name;
      if (age) student.age = age;

      if (parentEmail || parentName || parentAge) {
        let parentUser = await Parent.findById(student.parentId);

        if (!parentUser) {
          return next(createError("Parent not found", 404));
        }

        if (parentName) parentUser.name = parentName;
        if (parentEmail) parentUser.email = parentEmail;
        if (parentAge) parentUser.age = parentAge;

        await parentUser.save();
      }

      await student.save();
    } else if (user.role === ROLES.INSTRUCTOR) {
      const instructor = await Instructor.findOne({ userObjRef: userId });

      if (!instructor) {
        return next(createError("Instructor profile not found", 404));
      }

      if (name) instructor.name = name;

      if (email) instructor.email = email;

      await instructor.save();
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};





const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(createError("User not exist", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const message = `you are receiving this email because you has requested to reset your passsword \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "reset password",
        message,
      });

      res.status(200).json({ msg: "reset passsword been sent to your email" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(createError("reset password email could not been send", 500));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};





const resetPassword = async (req, res, next) => {
  try {
    // get the hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // get the user by the resetPasswordToken , resetPasswordExpire in the DB , that we set them in forgot-password route
    // and check that the resetPasswordToken not expired yet (greater than current time)
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) return next(createError("Invalid token", 400));

    // update user password , will be encrypted by our pre save mongoose hook
    user.password = req.body.password;

    // reset the resetPassword keys in the DB
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};





const getLoggedUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(createError("User not exist", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};





const getUser = async (req, res, next) => {
  try {
    res.status(200).send({ ...req.user._doc });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};




module.exports = {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
  getLoggedUser,
  getUser,
};
