import {DataTypeAbstract, ModelAttributeColumnOptions, Sequelize, Model} from "sequelize";
import { CalendarEventAttributes, CalendarEventCreationAttributes, CalendarEvent } from "./models/calendarevent";
import sequelize from "sequelize";

type SequelizeAttribute = string | DataTypeAbstract | ModelAttributeColumnOptions;

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: SequelizeAttribute
};


export interface DbInterface {
  sequelize: Sequelize;
  CalendarEvent: typeof CalendarEvent;
}