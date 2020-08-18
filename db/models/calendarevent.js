'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCalendarEvent = exports.CalendarEvent = void 0;
const sequelize_1 = require("sequelize");
class CalendarEvent extends sequelize_1.Model {
}
exports.CalendarEvent = CalendarEvent;
;
function initCalendarEvent(sequelize) {
    CalendarEvent.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        eventId: { type: sequelize_1.DataTypes.NUMBER, allowNull: false },
        icsData: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        dataHash: { type: sequelize_1.DataTypes.STRING, allowNull: false }
    }, { sequelize });
    // CalendarEvent.beforeCreate((event,options)=>{
    //   if(event.dataHash == undefined || null){
    //     const md5 = crypto.createHash('md5');
    //     const hashStr = md5.update(event.icsData).digest('hex');
    //     event.dataHash = hashStr;
    //   }
    // })
    return CalendarEvent;
}
exports.initCalendarEvent = initCalendarEvent;
//# sourceMappingURL=calendarevent.js.map