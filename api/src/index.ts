
import * as dotenv from "dotenv";
import express from "express";
import webcal from './routes/webcal';
import crawler from '../../fetcher/src';
dotenv.config();

const app = express();

app.use(webcal)

crawler.start();

app.listen(3000,()=>console.log("listening..."));