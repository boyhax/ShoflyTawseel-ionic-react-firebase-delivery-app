import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import { getApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { GeoPoint } from "firebase/firestore";
import * as geofirestore from "geofirestore";
import { idCard } from "ionicons/icons";
import { Config } from "../config";
import { orderMarker } from "../types";

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

    const query = this.geocollection.near({
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
   async  addGeo(id: string, latlng: LatLng, from: boolean) {
     
    return this.geocollection.add({
      id: id,
      from: from,
      // The coordinates field must be a GeoPoint!
      coordinates: new firebase.firestore.GeoPoint(latlng.lat,latlng.lng),
    });
}
}

const geoFirestore = new geoClass()
export default geoFirestore
