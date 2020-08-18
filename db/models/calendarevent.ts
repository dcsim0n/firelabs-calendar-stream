'use strict';
import { Sequelize, Model, DataTypes, ModelCtor, ModelDefined, Optional} from 'sequelize'
import crypto = require('crypto');

export interface CalendarEventAttributes {
  id: number,
  eventId: number,
  icsData: string,
  dataHash: string
}

export class CalendarEvent extends Model<CalendarEventAttributes, CalendarEventCreationAttributes>{
  public id!: number
  public eventId!: number
  public dataHash!: string
  public icsData!: string
}

export interface CalendarEventCreationAttributes extends Optional<CalendarEventAttributes, "id" >{};

export function initCalendarEvent(sequelize: Sequelize): typeof CalendarEvent{
  
  CalendarEvent.init({
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    eventId: { type: DataTypes.NUMBER, allowNull: false },
    icsData: { type: DataTypes.TEXT, allowNull: false },
    dataHash: { type: DataTypes.STRING, allowNull: false}
  }, {sequelize})

  // CalendarEvent.beforeCreate((event,options)=>{
  //   if(event.dataHash == undefined || null){
      
  //     const md5 = crypto.createHash('md5');
  //     const hashStr = md5.update(event.icsData).digest('hex');
  //     event.dataHash = hashStr;
  //   }
  // })
  
  return CalendarEvent;
}