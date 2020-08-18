
import * as dotenv from "dotenv";
import express from "express";
import webcal from './routes/webcal';

dotenv.config();

const app = express();

app.use(webcal)

app.listen(3000,()=>console.log("listening..."));