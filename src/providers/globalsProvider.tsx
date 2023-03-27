import React, { createContext, useContext, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import {
  userApplicationsStore,
  userOrdersStore,
  userReportsStore,
} from "../api/firebaseMain";
import { useIonAlert } from "@ionic/react";
import useOnline from "../hooks/useOnline";
import LoadingScreen from "../pages/LoadingScreen";
import { userStore } from "../Stores/userStore";

interface Props {
  
  currentOrder: DocumentSnapshot | undefined;
  setCurrentOrder: (doc: DocumentSnapshot) => void | undefined;
  presentAlert: any;
  dissmissAlert: () => void;
  userApplications: any;
  userOrders: any;
  userReports: any;

}
const initialProps: Props = {
  
  currentOrder: undefined,
  setCurrentOrder: (v: any) => undefined,
  presentAlert: "",
  dissmissAlert: () => "",
  userApplications: {},
  userOrders: {},
  userReports: {},
 
};
const globalsContext = createContext<Props>(initialProps);

const GlobalProvider: React.FC = (props) => {

  const [currentOrder, setCurrentOrder] = useState<DocumentSnapshot>();
  const { isOnline } = useOnline();

  const [presentAlert, dissmissAlert] = useIonAlert();
  const userOrders = userOrdersStore.useState();
  const userApplications = userApplicationsStore.useState();
  const userReports = userReportsStore.useState();
  const { user, profile } = userStore.useState();
  console.log("this.userOrders :>> ", userOrders);
  console.log("this.userApplication :>> ", userApplications);
  console.log("this.userReports :>> ", userReports);
  console.log("user :>> ", user);
  console.log("profile :>> ", profile);

  // const {mounted}=useMounted()


  const toProvide: Props = {
    
    setCurrentOrder,
    currentOrder,
    presentAlert,
    dissmissAlert,
    userApplications,
    userOrders,
    userReports,
  };
  if (!isOnline) {
    return (
      <div
        hidden={isOnline || user === undefined}
        className={"absolute z-50 w-full mx-auto "}
      >
        <p className={"text-xl text-center text-slate-300  bg-red-700"}>
          Intenet connection required
        </p>
      </div>
    );
  }else{
    if(user===undefined ||(user && profile===undefined)){
      return <LoadingScreen/>
    }
  }
  return (
    <globalsContext.Provider value={toProvide}>
      <div className={`${user === undefined && "hidden"}`}>
        {props.children}
      </div>
    </globalsContext.Provider>
  );
};
export const useGlobals = () => {
  return useContext(globalsContext);
};

export default GlobalProvider;
