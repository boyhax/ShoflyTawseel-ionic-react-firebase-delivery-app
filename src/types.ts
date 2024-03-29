import { GeoPoint } from "firebase/firestore";
import { LatLng } from "leaflet";
export interface MessageProps {
  iconURL:string,
  name:string
  time: any;
  text: string;
  data: any;
  from: string;
  isRead?: boolean;
}
export interface locationOption {
  value: Geolocation | any;
  title: string;
  subTitle?: string;
}
export interface Geolocation {
  latlng: LatLng;
  city: string;
  state?: string;
}
export interface OrderType {
  name: string;
  icon: any;
  value: OrderCatagorie;
}
export interface orderGeolocation {
  geo: LatLng;
  name: string;
  geohash: string;
}

export type OrderCatagorie =
  | "SmallObjects"
  | "Food"
  | "PeopleTrans"
  | "AnimalTrans"
  | "BigObjects";

export const OrderCatagories: OrderType[] = [
  {
    name: "Small Objects",
    icon: require("./assets/smallObjectsIcon.png"),
    value: "SmallObjects",
  },
  {
    name: "Food & Drinks",
    icon: require("./assets/take-away.png"),
    value: "Food",
  },
  {
    name: "People Transport",
    icon: require("./assets/peopleTransIcon.png"),
    value: "PeopleTrans",
  },
  {
    name: "Animal Transport",
    icon: require("./assets/animalsTrans.png"),
    value: "AnimalTrans",
  },
  {
    name: "Big Objects",
    icon: require("./assets/interior-design.png"),
    value: "BigObjects",
  },
];
export enum DriverStatus {
  active = "active",
  inactive = "inactive",
  banned = "banned",
  pending = "pending",
}
export interface driverData {
  car_image: string;
  car_number: string;
  car_card_image: string;
  driving_license_image: string;
  driver_id_image: string;
  driver_id: string;
  id: string;
  status: DriverStatus;
  working: boolean;
}

export interface UserProfile {
  id: string;
  driverData: driverData;
  name: string;
  phoneNumber: string;
  photoURL: string;
  email?: string;
  role: "user" | "driver" | "admin";
  status: "active" | "inactive" | "banned" | "pending";
  time: any;
}
export interface userInfo {
  name: string;
  photoURL: string;
  phoneNumber: string;
}

export interface ApplicationProps {
  id: string;
  byUser: string;
  forOrder: string;
  forUser: string;
  isAccepted: boolean;
  isDone: boolean;
  timeAccepted: any;
  timeDone: any;
  timeSend: any;
}
export interface ApplicationInfo {
  id: string;
  byUser: string;
  time: Date;
}
export interface OrderReportInfo {
  byUser: string;
  time: Date;
  why: string;
  id: string;
}
export interface OrderReportProps {
  byUser: string;
  time: any;
  why: string;
  OrderId: string;
}
export interface orderMarker {
  coordinates: GeoPoint;
  id: string;
  from: boolean;
}
export enum OrderStatus {
  Placed = "Placed",
  DriverAsigned = "DriverAsigned",
  DriverOnWayToCollect = "DriverOnWayToCollect",
  DriverOnWayToDeliver = "DriverOnWayToDeliver",
  Done = "Done",
  Canceled = "Canceled",
}
export interface orderProps {
  id: string;
  urgent: boolean;
  type: string;
  geo: { from: GeoPoint; to: GeoPoint };
  uid: string;
  from: google.maps.GeocoderResult | any;
  to: google.maps.GeocoderResult | any;
  time: any;
  phoneNumber?: string;
  comment: string | "";
  driver: string;
  status: OrderStatus;
  address: {
    from: string;
    to: string;
  };
  coordinates?: GeoPoint;
  g?: {
    geohash?: string;
    geopoint?: GeoPoint;
  };
}
export type newOrderProps = Pick<
  orderProps,
  "address" | "comment" | "geo" | "to" | "from" | "type" | "urgent"
>;
export interface keyValue {
  key: string;
  value: string;
}

export interface orderFilter {
  from?: keyValue | "";
  to?: keyValue | "";
  userID?: string;
  limit?: number;
  type?: OrderCatagorie | "";
  urgent?: boolean;
  afterDoc?: any;
}
