"use strict";

import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import methodOverride from "method-override";
import passport from "passport";
import helmet from "helmet";
import express from "express";
import schedule from "node-schedule";
import mongoose from "mongoose";
import routes from "./routes";
import models from "./models";
import controllers from "./controllers";
import config from "./config";
import loggers from "./services/logger";
import services from "./services";

/**
 * Application startup class
 *
 * @export
 * @class Bootstrap
 */
export default class Bootstrap {
  /**
   * Creates an instance of Bootstrap.
   * @param {object} app
   *
   * @memberOf Bootstrap
   */
  constructor(app) {
    this.app = app;
    this.middleware();
    this.connectDb();
    this.routes();
    this.start();
  }

  /**
   * Load all middleware
   * @memberOf Bootstrap
   */
  middleware() {
    let app = this.app;
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(methodOverride());
    app.use(passport.initialize());
    app.use(helmet());
    app.use("/assets", express.static(__dirname + "/uploads"));
    app.use("/images", express.static(__dirname + "/images"));
    app.use("/swagger", express.static(__dirname + "/swagger"));

    app.use(function(req, res, next) {
      if (req.connection.encrypted == undefined) {
        config.app.setBaseUrl("http://" + req.headers.host + "/");
      } else {
        config.app.setBaseUrl("https://" + req.headers.host + "/");
      }

      // Store api request logs
      let request = {
        url: "",
        body: "",
        query: "",
        method: "",
        hostname: "",
        ip: ""
      };
      request.url = req.originalUrl ? req.originalUrl : "";
      request.query = req.query ? req.query : "";
      request.method = req.method ? req.method : "";
      request.hostname = req.hostname ? req.hostname : "";
      request.ip = req.connection.remoteAddress ? req.connection.remoteAddress : "";
      if (req.body) {
        let body = Object.assign({}, req.body);
        delete body["password"];
        request.body = body;
      }
      request = JSON.stringify(request);
      loggers.apiInfoLogger.info(request);

      next();
     });
  }

  /**
   * Check database connection
   * @memberOf Bootstrap
   */
  connectDb() {
    // Mysql Connectivity
    let sequelize = models.sequelize;
    let migration = services.migration;
    sequelize
      .authenticate()
      .then(() => {
        loggers.infoLogger.info("Database connected successfully");
        sequelize
          .sync()
          .then(function() {
            migration.insertDefaultRecord(); //insert default records
            loggers.infoLogger.info("Database sync successfully");
          })
          .catch(function(error) {
            loggers.infoLogger.info(`Database syncing error %s`, error);
          });
      })
      .catch(error => {
        loggers.errorLogger.error(`Database connection error %s`, error);
      });

    // Mongodb Connectivity
    // mongoose.connect(config.database.mongodb.url, function (err) {
    //     if (err) {
    //         console.log(err);
    //         process.exit(0);
    //     } else {
    //         console.log('Mongodb connected');
    //     }
    // });
  }

  /**
   * Load all routes
   * @memberOf Bootstrap
   */
  routes() {
    routes(this.app);
  }

  /**
   * Start express server
   * @memberOf Bootstrap
   */
  start() {
    let app = this.app;
    let port = app.get("port");
    app.listen(port, () => {
      console.log(`Server has started on port %d`, port);
    });
  }
}
