
import models from '../models';
import {CalendarEvent} from '../models/calendarevent';

describe('CalendarEvent has correct attributes and is saved', ( )=>{

  
  afterAll((done)=>{
    models.CalendarEvent.truncate()
    .then(()=>{
      done();
    });
  })
  test('CalendarEvents can be created', (done) =>{
    const testEvent = {
      eventId:123456, 
      icsData: "Some ICS DATA HERE",
      dataHash: "ca86a3719bef53054a931f3acf90ed8e"
    }
    return models.CalendarEvent.create(testEvent)
    .then( (event ) =>{
      expect(event.eventId).toEqual(123456)
      expect(event.icsData).toEqual("Some ICS DATA HERE");
      expect(event.id).toBeTruthy();
      done();
    })

  })

  test('Events get an auto generated md5 hash', (done)=>{
    return models.CalendarEvent.findOne({where:{eventId: 123456}})
    .then( (event ) =>{
      console.log('Data Hash:', event!.dataHash);
      expect(event!.dataHash).toBeTruthy();
      done();
    })
  })
}); 

