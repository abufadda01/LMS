const express = require("express");

const {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
  getLoggedUser,
  getUser,
} = require("../controllers/usersControllers");

const { protectRoutes } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.put("/update-profile", protectRoutes, updateProfile);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:resetToken", resetPassword);

router.get("/get-logged-user", protectRoutes, getLoggedUser);

router.get("/get-user", protectRoutes, getUser);

module.exports = router;
