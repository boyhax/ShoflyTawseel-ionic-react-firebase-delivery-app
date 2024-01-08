import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, DocumentSnapshot, getFirestore } from "firebase/firestore";
import mydb, {
  userApplicationsStore,
  userOrdersStore,
  userReportsStore,
} from "../api/firebaseMain";
import { useIonAlert } from "@ionic/react";
import useOnline from "../hooks/useOnline";
import LoadingScreen from "../pages/LoadingScreen";
import { userStore } from "../Stores/userStore";
import OnlineRequiredRoute from "../routes/OnlineRequiredRoute";
import { UserProfile } from "../types";
import { User } from "firebase/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

interface Props {
  user: User | null;
  profile: UserProfile | null;
  currentOrder: DocumentSnapshot | undefined;
  setCurrentOrder: (doc: DocumentSnapshot) => void | undefined;
  presentAlert: any;
  dissmissAlert: () => void;
  userApplications: any;
  userOrders: any;
  userReports: any;
}
const initialProps: Props = {
  user: null,
  profile: null,
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
  // const [profile,loading,error] = useDocumentData(doc(getFirestore() as any , "users/",user? user?.uid:''))
  console.log("profile :>> ", profile);

  useEffect(() => {
    console.log("this.userOrders :>> ", userOrders);
    console.log("this.userApplication :>> ", userApplications);
    console.log("this.userReports :>> ", userReports);
    console.log("user :>> ", user);
    console.log("profile :>> ", profile);
  }, [user, profile]);


  const toProvide: Props = {
    user: user||null,
    profile:profile as UserProfile||null,
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
