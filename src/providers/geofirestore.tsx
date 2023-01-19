import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import { getApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { GeoPoint } from "firebase/firestore";
import * as geofirestore from "geofirestore";
import { idCard } from "ionicons/icons";
import { Config } from "../config";

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
    });
    const q = await query.get()
    var list:any[] = []
    q.forEach((d)=>{
      if(from){
        if(d.data().from){list.push(d)}
      }else{
        if(!d.data().from){list.push(d)}
      }
    })
    // Get query (as Promise)
    return list
  }
   async  addGeo(id: string, latlng: LatLng, from: boolean) {
     
    this.geocollection.add({
      name: id,
      from: from,
      // The coordinates field must be a GeoPoint!
      coordinates: new firebase.firestore.GeoPoint(latlng.lat,latlng.lng),
    });
}
}

const geoFirestore = new geoClass()
export default geoFirestore
