export interface locationOption  { value: Geolocation | any, title: string, subTitle?: string }
export interface Geolocation  { latlng: LatLng, city: string, state?: string }
export interface LatLng  { lat: string, lng: string }
export interface OrderType  { name: string, icon: any, value: OrderCatagorie }

export type OrderCatagorie = "SmallObjects" | 'Food' | 'PeopleTrans' | 'AnimalTrans' | 'BigObjects';

export const OrderCatagories: OrderType[] = [
  { name: 'Small Objects', icon: require('./assets/smallObjectsIcon.png'), value: 'SmallObjects' }
  , { name: 'Food & Drinks', icon: require('./assets/take-away.png'), value: 'Food' }
  , { name: 'People Transport', icon: require('./assets/peopleTransIcon.png'), value: 'PeopleTrans' }
  , { name: 'Animal Transport', icon: require('./assets/animalsTrans.png'), value: 'AnimalTrans' }
  , { name: 'Big Objects', icon: require('./assets/interior-design.png'), value: 'BigObjects' }]
  
  export interface UserProfile {
    name:string,
    phoneNumber:string,
    photoURL:string,
    email?:string
    devloper?:boolean
  }
  export interface userInfo{
    name:string,
    photoURL:string,
    phoneNumber:string|""
  }
  
  export interface ApplicationProps {
    byUser:string,
    forOrder:string,
    forUser:string,
    isAccepted:boolean,
    isDone:boolean,
    timeAccepted:any,
    timeDone:any,
    timeSend:any,
  }
  export interface ApplicationInfo{
    id:string,
    byUser:string,
    time:Date
  }
  export interface OrderReportInfo{
    byUser:string,
    time:Date,
    why:string,
    id:string
  }
  export interface OrderReportProps{
    byUser:string,
    time:Date,
    why:string,
    OrderId:string
  }
  export interface orderProps{
    urgent:boolean,
    type:string,
    uid:string,
    from:keyValue,
    to:keyValue,
    time:any,
    comment:string|undefined|null,
    reports:OrderReportInfo[],
    applications:ApplicationInfo[]
  
  }
  export interface newOrderProps {
    to:keyValue,
    from:keyValue,
    urgent?:boolean,
    geoLocation?:Geolocation,
    comment?:string,
    type?:OrderCatagorie
  
  }
  export interface keyValue{
    key:string,
    value:string
  }

  export interface orderFilter{
    from?:keyValue|"",
    to?:keyValue|"",
    userID?:string,
    limit?:number,
    type?:OrderCatagorie|'',
    urgent?:boolean
  }