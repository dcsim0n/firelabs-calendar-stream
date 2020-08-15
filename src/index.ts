require('dotenv').config();
import axios, { AxiosResponse } from 'axios';
import { JSDOM } from 'jsdom';
import {queue} from 'async';


const EVENTS:string = "https://roswellfirelabs.org/events?EventViewMode=1&EventListViewMode=2&SelectedDate=8/15/2020&CalendarViewType=0"
const EVENT_LINK_SELECTOR:string = ".EventListCalendar a";
const EVENT_ID_REGEX = /https:\/\/roswellfirelabs\.org\/event-(\d{6})/

interface IEventLink{
  id: number,
  url: string
}



const CrawlerQueue = queue( (task: IEventLink, cb)=>{
  axios.get(task.url)
  .then((resp)=>{
    console.log(`Fetched data for ${task.id}, length: ${resp.data.length}`)
    cb();
  })
}, 4);

axios.get(EVENTS)
.then((resp)=>{
  const events_page = new JSDOM(resp.data)

  const link_nodes = <NodeListOf<HTMLAnchorElement>> events_page.window.document.querySelectorAll(EVENT_LINK_SELECTOR);
  let links: Array<IEventLink> = [];  
  for (let i = 0; i < link_nodes.length; i++) {
    const eventUrl = link_nodes[i].href;
    const id_str = eventUrl.match(EVENT_ID_REGEX);
    if(id_str){
      links.push({id: parseInt(id_str[1]), url: eventUrl })
    }
  }
  console.log(links);
  return links
})
.then( links =>{

  // for each link
  CrawlerQueue.push(links)
  
  console.log(`queue length is: ${CrawlerQueue.length()}`)
  // fetch the event page
  // parse the ics link from the event page
  // save and/or download the ics file
  // don't duplicate work
  // maybe should de-dup the links array before getting here
  return CrawlerQueue.drain(()=>{
    console.log("Finished fetching");
  })
});
