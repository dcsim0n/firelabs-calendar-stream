
import models from '../models';

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
    .then( event =>{
      expect(event.eventId).toEqual(123456)
      expect(event.icsData).toEqual("Some ICS DATA HERE");
      expect(event.id).toBeTruthy();
      done();
    })

    test
  })
}); 

