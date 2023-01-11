import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import { getApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { GeoPoint } from "firebase/firestore";
import * as geofirestore from "geofirestore";
import { Config } from "../config";

export class geoClass {
  geocollection;
  constructor() {
    firebase.initializeApp(Config());
    const firestore = firebase.firestore();

    // Create a GeoFirestore reference
    const GeoFirestore = geofirestore.initializeApp(firestore);

    // Create a GeoCollection reference
    this.geocollection = GeoFirestore.collection("ordersGeo");
    // Add a GeoDocument to a GeoCollection
    

    // Create a GeoQuery based on a location
    

  }
  async getGeoQuery(location:LatLng){
    const query = this.geocollection.near({
      center: new firebase.firestore.GeoPoint(location.lat,location.lng),
      radius: 1000,
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

const geofirestoreinstance = new geoClass()
export default geofirestoreinstance
