"use strict";

import express from "express";
import Bootstrap from "./bootstrap";

let app = express();
app.set("port", process.env.PORT || 3600);
let bootstrap = new Bootstrap(app);
