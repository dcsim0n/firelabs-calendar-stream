declare module 'ics-to-json'{

  type TIcsData = {
    EVENT: string,
    EVENT_START: string,
    EVENT_END: string,
    START_DATE: string,
    DESCRIPTION: string,
    SUMMARY: string,
    LOCATION: string,
    ALARM: string,
    
  }
  export default function icsToJson(data:string): TIcsData 
}