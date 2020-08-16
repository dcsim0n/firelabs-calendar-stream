/// <reference path="../types/ics-to-json.d.ts" />

import express from 'express'
import models from '../../../db/models';
import icsToJson from 'ics-to-json';

const router = express.Router();

router.get('/api/1/webcal',function(req,resp){

  models.CalendarEvent.findOne({where:{eventId: 3893878}})
  .then(event =>{
    if(event){
      resp.json(icsToJson(event.icsData));
    }
  })
})


export default router;