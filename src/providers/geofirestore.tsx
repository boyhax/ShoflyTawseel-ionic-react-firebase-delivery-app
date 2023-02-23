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
import { orderMarker, OrderStatus } from "../types";

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

  async getGeoQuery(location:LatLng,radius:number,from:boolean){
    const geocollection = this.GeoFirestore.collection(from?'ordersGeoFrom':'ordersGeoTo')
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(location.lat,location.lng),
      radius: radius,
      limit:5
    });
    const q = await query.get()
    var list = [...q.docs]
    list = list.filter((v)=>{
      return from?v.data().from===true:false  
    })
    
    return list
  }
  async getCity(point:GeoPoint,onResult:(coty:string)=>void=(d:string)=>{}){
    const url =`https://api.bigdatacloud.net/data/
    reverse-geocode-client?latitude=${point.latitude}
    &longitude=${point.longitude}&localityLanguage=${getLang()}`

    let t =  await (await fetch(url, {
      method: 'GET',
      headers: {}
    })).json()
    onResult(t?t.city:'')
    return t?t.city:''
  }
   async  addGeo(id: string, latlng: LatLng, from: boolean) {
    const geocollection = this.GeoFirestore.collection(from?'ordersGeoFrom':'ordersGeoTo')

    return geocollection.add({
      id: id,
      from: from,
      status:OrderStatus.Placed,
      // The coordinates field must be a GeoPoint!
      coordinates: new firebase.firestore.GeoPoint(latlng.lat,latlng.lng),
    });
}
}

const geoFirestore = new geoClass()
export default geoFirestore
