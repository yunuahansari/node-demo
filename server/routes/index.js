"use strict";

import { Router, express } from "express";
import auth from "./auth";
import admin from "./admin";

let router = Router();
let register = app => {
  router.use("/api", [auth, admin]);
  app.use(router);

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      success: false,
      data: null,
      error: error,
      message: error.message
    });
  });

  app.use((req, res, next) => {
    let error = new Error("Not Found");
    error.status = 404;
    res.status(error.status).json({
      success: false,
      data: null,
      error: error,
      message: error.message
    });
  });
};

export default register;
