"use strict";

import { Router } from "express";
import controllers from "../controllers";
import validators from "../validators";
import helpers from "../helpers";
import path from "path";

let router = Router();
let auth = controllers.auth;
let admin = controllers.admin;  
let validator = validators.authValidator;
let { driverValidator } = validators;

router.post("/auth/login", validator.validateUserLogin, auth.login);
router.post("/auth/logout", auth.checkAdminAuthenticated, auth.logout);
router.post(
  "/auth/change-password",
  auth.checkAdminAuthenticated,
  validator.validateChangePassword,
  auth.changePassword
);
router.post("/auth/forgot-password", auth.forgotPassword);
router.post(
  "/auth/reset-password",
  validator.validateResetPassword,
  auth.resetPassword
);

export default router;
