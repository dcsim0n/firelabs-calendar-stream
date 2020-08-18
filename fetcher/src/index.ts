import Crawler from './crawler'
require('dotenv').config();

const config = require('./fetcher.json');


const crawler = new Crawler(config)


crawler.start();

process.on('SIGINT', ()=>{
  console.log("Exiting, cleaning up...")
  crawler.stop();
})