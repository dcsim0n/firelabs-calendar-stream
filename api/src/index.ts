
import * as dotenv from "dotenv";
import express from "express";
import webcal from './routes/webcal';
import models from '../../db/models'
dotenv.config();

const app = express();

app.use(webcal)

models.sequelize.sync().then(()=>{
  app.listen(process.env.PORT || 3000,()=>console.log("listening..."));
})