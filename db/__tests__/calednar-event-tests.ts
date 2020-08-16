
import models from '../models';
import {CalendarEvent} from '../models/calendarevent';

describe('CalendarEvent has correct attributes and is saved', ( )=>{

  afterAll((done)=>{
    models.CalendarEvent.truncate();
  })
  test('CalendarEvents can be created', (done) =>{
    const testEvent = {
      eventId:123456, 
      icsData: "Some ICS DATA HERE",
      dataHash: "some hash data"
    }
    return models.CalendarEvent.create(testEvent)
    .then( (event ) =>{
      expect(event!.eventId).toEqual(123456)
      expect(event!.icsData).toEqual("Some ICS DATA HERE");
      expect(event!.id).toBeTruthy();
      done();
    })

  })

  test('Events get an auto generated md5 hash', (done)=>{
    return models.CalendarEvent.findByPk('123456')
    .then( (event ) =>{
      console.log('Data Hash:', event!.dataHash);
      expect(event!.dataHash).toBeTruthy();
    })
  })
}); 

