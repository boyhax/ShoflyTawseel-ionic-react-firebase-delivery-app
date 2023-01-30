import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

interface Props {
  user: boolean | undefined;
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
  user: false,
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
  const [user, setUser] = useState<boolean | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile>();
  const [currentOrder, setCurrentOrder] = useState<DocumentSnapshot>();
  const { isOnline } = useOnline();

  const { getEmail, getPhone } = useSignTools();
  // const { userApplications, userOrders, userReports } = useUserHooks();

  const [presentAlert, dissmissAlert] = useIonAlert();
  const userOrders = userOrdersStore.useState();
  const userApplications = userApplicationsStore.useState();
  const userReports = userReportsStore.useState();

  console.log("this.userOrders :>> ", userOrders);
  console.log("this.userapplication :>> ", userApplications);
  console.log("this.userReports :>> ", userReports);

  useEffect(() => {
    return onAuthStateChanged(
      getAuth(),
      (user) => {
        console.log("user  :>> ", !!user);
        setUser(!!user);
        user && mydb.subscripeUserList(user.uid);
        !user && mydb.unSubscripeUserList();
      },
      (err) => {
        console.log(err, "error in user sign in check");
      }
    );
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = fetchProfile();
      return () => {
        unsub();
      };
    }
  }, [user]);

  function fetchProfile() {
    const uid = getAuth().currentUser!.uid;
    const ref = doc(getFirestore(), "users", uid);

    return onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        const p: any = UserProfileFromDoc(doc);
        setProfile(p);

        console.log("profile :>> ", p);
      } else {
        hundleNoProfileCreatedYet();
      }
      async function hundleNoProfileCreatedYet() {
        const user = getAuth().currentUser!;
        const name = user.displayName || "User" + user.uid.slice(0, 5);
        const number: string = user.phoneNumber || (await getPhone()) || "";
        const email: string =
          (user.emailVerified && user.email) || (await getEmail()) || "";
        const photo = "https://ui-avatars.com/api/?name=NAME".replace(
          "NAME",
          name
        );
        createNewProfileForThisUser(name, number, email, photo);
      }
      console.log("profile is complete :>> ", doc.exists());
    });
  }

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
