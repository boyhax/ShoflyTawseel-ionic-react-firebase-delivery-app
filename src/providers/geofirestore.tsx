import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import { getApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { GeoPoint } from "firebase/firestore";
import * as geofirestore from "geofirestore";
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
    // Add a GeoDocument to a GeoCollection
    

    // Create a GeoQuery based on a location
    

  }

  async getGeoQuery(location:LatLng,radius:number,collection:string){
    const col = this.GeoFirestore.collection(collection);

    const query = col.near({
      center: new firebase.firestore.GeoPoint(location.lat,location.lng),
      radius: radius,
    });

    // Get query (as Promise)
    return query.get()
  }
   async  addGeo(id: string, latlng: LatLng, from: boolean) {

    const collection = from ? "ordersFromGeo" : "ordersToGeo"
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
