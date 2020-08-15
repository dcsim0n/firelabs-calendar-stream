"use strict";
exports.__esModule = true;
require('dotenv').config();
var axios_1 = require("axios");
var jsdom_1 = require("jsdom");
var async_1 = require("async");
var EVENTS = "https://roswellfirelabs.org/events?EventViewMode=1&EventListViewMode=2&SelectedDate=8/15/2020&CalendarViewType=0";
var EVENT_LINK_SELECTOR = ".EventListCalendar a";
var EVENT_ID_REGEX = /https:\/\/roswellfirelabs\.org\/event-(\d{6})/;
var CrawlerQueue = async_1.queue(function (task, cb) {
    axios_1["default"].get(task.url)
        .then(function (resp) {
        console.log("Fetched data for " + task.id + ", length: " + resp.data.length);
        cb();
    });
}, 4);
axios_1["default"].get(EVENTS)
    .then(function (resp) {
    var events_page = new jsdom_1.JSDOM(resp.data);
    var link_nodes = events_page.window.document.querySelectorAll(EVENT_LINK_SELECTOR);
    var links = [];
    for (var i = 0; i < link_nodes.length; i++) {
        var eventUrl = link_nodes[i].href;
        var id_str = eventUrl.match(EVENT_ID_REGEX);
        if (id_str) {
            links.push({ id: parseInt(id_str[1]), url: eventUrl });
        }
    }
    console.log(links);
    return links;
})
    .then(function (links) {
    // for each link
    CrawlerQueue.push(links);
    console.log("queue length is: " + CrawlerQueue.length());
    // fetch the event page
    // parse the ics link from the event page
    // save and/or download the ics file
    // don't duplicate work
    // maybe should de-dup the links array before getting here
    return CrawlerQueue.drain(function () {
        console.log("Finished fetching");
    });
});
