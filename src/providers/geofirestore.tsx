import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import { getApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { GeoPoint } from "firebase/firestore";
import * as geofirestore from "geofirestore";
import { Http2ServerRequest } from "http2";
import { idCard } from "ionicons/icons";
import { getLang } from "../App";
import { Config } from "../config";
import { newOrderProps, orderMarker, orderProps, OrderStatus } from "../types";
import mydb from "./firebaseMain";

class geoClass {
  geocollection;
  GeoFirestore;
  constructor() {
    firebase.initializeApp(Config());
    const firestore = firebase.firestore();

    // Create a GeoFirestore reference
    this.GeoFirestore = geofirestore.initializeApp(firestore);

    // Create a GeoCollection reference
    this.geocollection = this.GeoFirestore.collection("ordersGeo");
  }

  async getGeoQuery(location: LatLng, radius: number, from: boolean) {
    const geocollection = this.GeoFirestore.collection("ordersGeoFrom");

    const query = geocollection
      .near({
        center: new firebase.firestore.GeoPoint(location.lat, location.lng),
        radius: radius,
        limit: 5,
      })
      .where("status", "==", OrderStatus.Placed);
    const list = await query.get().then((d) => d.docs ?? []);
    // var list = [...q.docs]
    // list = list.filter((v)=>{
    //   return from?v.data().from===true:false
    // })
    console.log("qeo query list :>> ", list);
    return list;
  }
  async addOrder(order: newOrderProps) {
    const geocollection = this.GeoFirestore.collection("orders");

    return geocollection.add({
      ...order,
      coordinates: order.geo.from,
    });
  }
  async getNearOrder(point: LatLng, radius: number = 20) {
    const geocollection = this.GeoFirestore.collection("orders");
    const uid = mydb.user?.uid ?? "";
    const query = geocollection
      .near({
        center: new firebase.firestore.GeoPoint(point.lat, point.lng),
        radius: radius,
        limit: 5,
      })
      .where("status", "==", OrderStatus.Placed);
    const list: orderProps[] = await query.get().then((d) =>
      d.docs
        .filter((v) => v.data().uid !== uid && !v.data().driver  )
        .map((d) => {
          return { id: d.id, ...d.data() } as orderProps;
        })
    );

    console.log("qeo query list :>> ", list);
    return list;
  }

  async addGeo(id: string, latlng: LatLng, from: boolean) {
    const geocollection = this.GeoFirestore.collection(
      from ? "ordersGeoFrom" : "ordersGeoTo"
    );

    return geocollection.add({
      id: id,
      from: from,
      status: OrderStatus.Placed,
      // The coordinates field must be a GeoPoint!
      coordinates: new firebase.firestore.GeoPoint(latlng.lat, latlng.lng),
    });
  }
}

const geoFirestore = new geoClass();
export default geoFirestore;
