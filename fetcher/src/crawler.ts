import axios, { AxiosResponse } from 'axios';
import crypto = require('crypto');
import { JSDOM } from 'jsdom'
import { queue, AsyncQueue, ErrorCallback } from 'async';
import models from '../../db/models';

type TCrawlerConfig = {
  CRAWL_URL: string;
  REFRESH_RATE: number;
  WORKERS: number;
  QUERY_SELECTOR: string;
}

interface IEventLink{
  id: number,
  url: string
}

export default class Crawler {
  private url: string
  private refreshRate: number
  private workers: number 
  private interval: NodeJS.Timeout | undefined
  private q: AsyncQueue<IEventLink>
  private eventIdRegex: RegExp
  private querySelector: string

  constructor(options:TCrawlerConfig) {
    this.url  = options.CRAWL_URL
    this.refreshRate = options.REFRESH_RATE
    this.workers = options.WORKERS
    this.querySelector = options.QUERY_SELECTOR
    this.eventIdRegex = /https:\/\/roswellfirelabs\.org\/event-(\d{6,10})/
    this.q = queue(this.queueWorker, this.workers);
    this.q.drain(()=>{
      console.log("Finished crawling...");
    });
  }

  public start = () => {

    if(this.interval){
      console.log("Clearing old interveral...")
      clearInterval(this.interval);
    }
    console.log("Starting queue...")
    this.fetchAndEnqueue();
    this.interval = setTimeout(this.fetchAndEnqueue, this.refreshRate)
  }

  public stop = () => {
    this.interval && clearInterval(this.interval);
  }

  private queueWorker = ( task: IEventLink, cb:ErrorCallback) => {
    const url = `https://roswellfirelabs.org/event-${task.id}/Export`;
    console.log(`Fetching url: ${url}`)
    let dataHash =  '';
    let icsData = '';
    axios.get(url)
    .then((resp)=>{
      console.log(`Fetched data for ${task.id}, length: ${resp.data.length}`)
      dataHash = this.hashEventFromStr(resp.data)
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
  }

  private hashEventFromStr = (icsData:string) => {
    const md5 = crypto.createHash('md5');
    md5.update(icsData);
    return md5.digest('hex');
  }

  public fetchAndEnqueue = () => {
    axios.get(this.url)
    .then((resp)=>{
      const events_page = new JSDOM(resp.data)
      const link_nodes = <NodeListOf<HTMLAnchorElement>> events_page.window.document.querySelectorAll(this.querySelector);
      const links = new Map<number,IEventLink>()
      for (let i = 0; i < link_nodes.length; i++) {
        const url = link_nodes[i].href;
        //extract the event id from url
        const id_str = url.match(this.eventIdRegex);
        if(id_str){
          const id = parseInt(id_str[1]);
          links.set(id, {id, url});
        }
      }
      console.log(links);
      return links
    })
    .then( links =>{
      links.forEach(event =>{
        this.q.push(event)
      })
      console.log(`queue length is: ${this.q.length()}`)
    });
  }
}
