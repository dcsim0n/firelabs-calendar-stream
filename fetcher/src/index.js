"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crawler_1 = __importDefault(require("./crawler"));
require('dotenv').config();
const config = require('./fetcher.json');
const crawler = new crawler_1.default(config);
crawler.start();
//# sourceMappingURL=index.js.map