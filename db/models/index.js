'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const sequelize_1 = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const calendarevent_1 = require("./calendarevent");
let sequelize;
if (config.use_env_variable) {
    sequelize = new sequelize_1.Sequelize(process.env[config.use_env_variable], config);
}
else {
    sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, config);
}
const db = {
    sequelize,
    CalendarEvent: calendarevent_1.initCalendarEvent(sequelize)
};
exports.default = db;
//# sourceMappingURL=index.js.map