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
import OnlineRequiredRoute from "../routes/OnlineRequiredRoute";

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
  
  return (
    <globalsContext.Provider value={toProvide}>
      <OnlineRequiredRoute>
        {user === undefined || (user && profile === undefined) ? (
          <LoadingScreen />
        ) : (
          props.children
        )}
        
      </OnlineRequiredRoute>
    </globalsContext.Provider>
  );
};
export const useGlobals = () => {
  return useContext(globalsContext);
};

export default GlobalProvider;
