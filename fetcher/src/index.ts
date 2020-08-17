require('dotenv').config();
import axios, { AxiosResponse } from 'axios';
import { JSDOM } from 'jsdom';
import {queue} from 'async';
import path = require('path');
import fs = require('fs');
import models from '../../db/models';
import crypto = require('crypto');


const EVENTS:string = "https://roswellfirelabs.org/events?EventViewMode=1&EventListViewMode=2&SelectedDate=8/15/2020&CalendarViewType=0"
const EVENT_LINK_SELECTOR:string = ".EventListCalendar a";
const EVENT_ID_REGEX = /https:\/\/roswellfirelabs\.org\/event-(\d{6,10})/

interface IEventLink{
  id: number,
  url: string
}

function hashFromStr(data:string):string{
  const md5 = crypto.createHash('md5');
  md5.update(data);
  return md5.digest('hex');
}

const CalendarCrawler = queue( (task: IEventLink, cb)=>{
  const url = `https://roswellfirelabs.org/event-${task.id}/Export`;
  console.log(`Fetching url: ${url}`)
  let dataHash =  '';
  let icsData = '';
  axios.get(url)
  .then((resp)=>{
    console.log(`Fetched data for ${task.id}, length: ${resp.data.length}`)
    dataHash = hashFromStr(resp.data);
    icsData = resp.data;
    const eventObject = {
      where: {eventId: task.id},
      defaults:{
        eventId: task.id,
        icsData,
        dataHash
      }
    }
    return models.CalendarEvent.findOrCreate(eventObject)
  })
  .then(([event, createdYN])=>{
    if(event.dataHash !==dataHash){
      console.log(`Hash ${event.dataHash} does not match ${dataHash} updating row`)
      event.update({
        dataHash,
        icsData
      })
    }
    cb()
  })
  .catch( err =>{
    console.log(`Fetch failed for event id: ${task.id}, ${err.message}`)
    cb(err)
  })
}, 4);

function crawlEvents(){
  axios.get(EVENTS)
  .then((resp)=>{
    const events_page = new JSDOM(resp.data)

    const link_nodes = <NodeListOf<HTMLAnchorElement>> events_page.window.document.querySelectorAll(EVENT_LINK_SELECTOR);
    const links = new Map<number,IEventLink>()
    for (let i = 0; i < link_nodes.length; i++) {
      const eventUrl = link_nodes[i].href;
      const id_str = eventUrl.match(EVENT_ID_REGEX);
      if(id_str){
        const id = parseInt(id_str[1]);
        links.set(id, {id: id, url: eventUrl });
      }
    }
    console.log(links);
    return links
  })
  .then( links =>{

    // for each link
    links.forEach(event =>{
      CalendarCrawler.push(event)
    })
    
    console.log(`queue length is: ${CalendarCrawler.length()}`)
    // fetch the event page
    // parse the ics link from the event page
    // save and/or download the ics file
    // don't duplicate work
    // maybe should de-dup the links array before getting here
    return CalendarCrawler.drain(()=>{
      console.log("Finished fetching");
    })
  });
}
crawlEvents();
setInterval(crawlEvents,3600000);