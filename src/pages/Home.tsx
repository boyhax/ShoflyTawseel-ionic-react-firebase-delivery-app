import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import HomeDriver from "./HomeDriver";
import HomeUser from "./HomeUser";
import useDriverUserMode from "../hooks/useDriverUserMode";
import {
  useCollectionDataOnce,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { mydb } from "../api/firebaseMain";
import { IonButton } from "@ionic/react";

const Home = () => {
  const { driverMode } = useDriverUserMode();
  const [clicked,setClicked] = useState(0)
  // const [data, loading, error] = useCollectionDataOnce(
  //   query(collection(getFirestore(), "orders/"), orderBy("time", "asc"))
  // );
  // useEffect(() => {
  //   console.log("user => ", data, loading, error);

  // }, [data]);
  const click=()=>{
    setClicked(clicked+1)
  }
  return <React.Fragment>

    {driverMode ? <HomeDriver /> : <HomeUser />}
    
    </React.Fragment>;
};

export default Home;
