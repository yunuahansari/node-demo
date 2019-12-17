'use strict';

import fs from 'fs';
import Sequelize from 'sequelize';
import path from 'path';
import config from '../config';
import logger from '../services/logger';

let dbConfig = config.database.mysql;
let db = {};

let sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    timezone: dbConfig.timezone,
    define: {
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        }
    },
    logging: (message) => {
        logger.infoLogger.info(message)
    },
});

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(file => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
    if (db[modelName].seedData) {
        db[modelName].seedData(config);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;