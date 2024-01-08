import { getAuth } from "firebase/auth";
import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import * as React from "react";
import { useState } from "react";
import {
  getOrders,
  subscripeUserOrders,
  userOrdersStore,
} from "../api/firebaseMain";

const useUserOrders = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [mounted, setMounted] = useState(true);
  const uid = getAuth().currentUser?.uid!;
  const orders = userOrdersStore.useState();
  React.useEffect(() => {
    uid && update();
    return () => setMounted(false);
  }, []);

  const update = () => {
    // setLoading(true);
    // subscripeUserOrders(uid, (v) => {
    //   setOrders(v);
    //   if (mounted) {
    //     setLoading(false);
    //   }
    //   return mounted ? false : true;
    // });
  };

  return { orders, loading, update };
};
export default useUserOrders;
