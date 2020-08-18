"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto = require("crypto");
const jsdom_1 = require("jsdom");
const async_1 = require("async");
const models_1 = __importDefault(require("../../db/models"));
class Crawler {
    constructor(options) {
        this.start = () => {
            if (this.interval) {
                console.log("Clearing old interveral...");
                clearInterval(this.interval);
            }
            console.log("Starting queue...");
            this.fetchAndEnqueue();
            this.interval = setTimeout(this.fetchAndEnqueue, this.refreshRate);
        };
        this.stop = () => {
            this.interval && clearInterval(this.interval);
        };
        this.queueWorker = (task, cb) => {
            const url = `https://roswellfirelabs.org/event-${task.id}/Export`;
            console.log(`Fetching url: ${url}`);
            let dataHash = '';
            let icsData = '';
            axios_1.default.get(url)
                .then((resp) => {
                console.log(`Fetched data for ${task.id}, length: ${resp.data.length}`);
                dataHash = this.hashEventFromStr(resp.data);
                icsData = resp.data;
                const eventObject = {
                    where: { eventId: task.id },
                    defaults: {
                        eventId: task.id,
                        icsData,
                        dataHash
                    }
                };
                return models_1.default.CalendarEvent.findOrCreate(eventObject);
            })
                .then(([event, createdYN]) => {
                if (event.dataHash !== dataHash) {
                    console.log(`Hash ${event.dataHash} does not match ${dataHash} updating row`);
                    event.update({
                        dataHash,
                        icsData
                    });
                }
                cb();
            })
                .catch(err => {
                console.log(`Fetch failed for event id: ${task.id}, ${err.message}`);
                cb(err);
            });
        };
        this.hashEventFromStr = (icsData) => {
            const md5 = crypto.createHash('md5');
            md5.update(icsData);
            return md5.digest('hex');
        };
        this.fetchAndEnqueue = () => {
            axios_1.default.get(this.url)
                .then((resp) => {
                const events_page = new jsdom_1.JSDOM(resp.data);
                const link_nodes = events_page.window.document.querySelectorAll(this.querySelector);
                const links = new Map();
                for (let i = 0; i < link_nodes.length; i++) {
                    const url = link_nodes[i].href;
                    //extract the event id from url
                    const id_str = url.match(this.eventIdRegex);
                    if (id_str) {
                        const id = parseInt(id_str[1]);
                        links.set(id, { id, url });
                    }
                }
                console.log(links);
                return links;
            })
                .then(links => {
                links.forEach(event => {
                    this.q.push(event);
                });
                console.log(`queue length is: ${this.q.length()}`);
            });
        };
        this.url = options.CRAWL_URL;
        this.refreshRate = options.REFRESH_RATE;
        this.workers = options.WORKERS;
        this.querySelector = options.QUERY_SELECTOR;
        this.eventIdRegex = /https:\/\/roswellfirelabs\.org\/event-(\d{6,10})/;
        this.q = async_1.queue(this.queueWorker, this.workers);
        this.q.drain(() => {
            console.log("Finished crawling...");
        });
    }
}
exports.default = Crawler;
//# sourceMappingURL=crawler.js.map