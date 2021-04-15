declare module 'ics-to-json'{

  type TIcsData = {
    starDate: string,
    endDate: string,
    description: string,
    summary: string,
    location: string,
  }
  export default function icsToJson(data:string): TIcsData 
}