"use strict";
/// <reference path="../types/ics-to-json.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("../../../db/models"));
const router = express_1.default.Router();
router.get('/api/1/events.ics', function (req, resp) {
    let respStr = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Roswell Firelabs//Event Calendar//EN\nMETHOD:PUBLISH\nCALSCALE:GREGORIAN\nX-WR-CALNAME:Events \nX-WR-TIMEZONE:UTC\n";
    models_1.default.CalendarEvent.findAll()
        .then(allEvents => {
        allEvents.forEach(event => {
            const { icsData } = event;
            const dataLength = icsData.length;
            const icsWoHeader = event.icsData.slice(46, dataLength - 1).slice(0, -14);
            respStr += icsWoHeader;
        });
        respStr += "\nEND:VCALENDAR\n";
        resp.set('Content-Type', 'text/calendar;charset=utf-8');
        resp.set('Content-Disposition', 'attachment; filename="firelabs.events.ics"');
        resp.send(respStr);
    });
});
exports.default = router;
//# sourceMappingURL=webcal.js.map