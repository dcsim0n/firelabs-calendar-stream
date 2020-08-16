'use strict';
import { Sequelize, Model, DataTypes, ModelCtor, ModelDefined, Optional} from 'sequelize'

export interface CalendarEventAttributes {
  id: number,
  eventId: number,
  icsData: string,
  dataHash: string
}

export interface CalendarEventCreationAttributes extends Optional<CalendarEventAttributes, "id">{};

export function initCalendarEvent(sequelize: Sequelize){
  const CalendarEvent: ModelDefined<CalendarEventAttributes, CalendarEventCreationAttributes> = sequelize.define(
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