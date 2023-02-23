import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { token } from "../App";
import {
  createNewProfileForThisUser,
  mydb,
  userApplicationsStore,
  userOrdersStore,
  UserProfileFromDoc,
  userReportsStore,
} from "./firebaseMain";
import { UserProfile } from "../types";
import { useIonAlert } from "@ionic/react";
import useOnline from "../hooks/useOnline";
import useSignTools from "../hooks/useSignTools";
import useUserHooks from "../hooks/userHooks";
import LoadingScreen from "../pages/LoadingScreen";
import useMounted from "../hooks/useMounted";
import { userStore } from "../Stores/userStore";

interface Props {
  user: User | null;
  profile: UserProfile | undefined;
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
  profile: undefined,
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
  const {user,profile} = userStore.useState(s=>s)
  console.log("this.userOrders :>> ", userOrders);
  console.log("this.userapplication :>> ", userApplications);
  console.log("this.userReports :>> ", userReports);
  const {mounted}=useMounted()
  useEffect(() => {
    // return onAuthStateChanged(
    //   getAuth(),
    //   (user) => {
    //     console.log("user  :>> ", !!user);
    //     mounted && setUser(!!user);
    //     user && mydb.subscripeUserList(user.uid);
    //     !user && mydb.unSubscripeUserList();
    //   },
    //   (err) => {
    //     console.log(err, "error in user sign in check");
    //   }
    // );
  }, []);

  useEffect(() => {
    
  }, [user]);

  

  const toProvide: Props = {
    user,
    profile,
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
      <div hidden={isOnline ||user === undefined} className={"absolute z-50 w-full mx-auto "}>
        <p className={"text-xl text-center text-slate-300  bg-red-700"}>
          Intenet connection required
        </p>
      </div>
      {user ===undefined? <LoadingScreen />:''}
      <div className={`${user===undefined &&'hidden'}`}>{props.children}</div>
    </globalsContext.Provider>
  );
};
export const useGlobals = () => {
  return useContext(globalsContext);
};

export default GlobalProvider;
