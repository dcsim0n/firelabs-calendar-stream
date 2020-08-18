import Crawler from './crawler'
require('dotenv').config();

const config = require('./fetcher.json');


const crawler = new Crawler(config)


export default crawler;

