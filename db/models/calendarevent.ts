'use strict';
import { Sequelize, Model, DataTypes, ModelCtor} from 'sequelize'

interface CalendarEventInstance extends Model{
  id: number,
  eventId: number,
  icsData: string,
  dataHash: string
}

export function initCalendarEvent(sequelize: Sequelize):ModelCtor<CalendarEventInstance>{
  const CalendarEvent = sequelize.define<CalendarEventInstance>(
    'CalendarEvent',
    {
      id: {type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true},
      eventId: DataTypes.NUMBER,
      icsData: DataTypes.STRING,
      dataHash: DataTypes.STRING
    }
  )

  return CalendarEvent;
}