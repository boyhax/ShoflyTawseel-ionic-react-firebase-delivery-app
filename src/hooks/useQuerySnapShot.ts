import { onSnapshot, Query, QuerySnapshot } from "firebase/firestore";
import * as React from "react";
import { useState } from "react";

export default function useQuerySnapShot(query:Query) {
  const [loading,setLoading] = useState(true);
  const [data,setData] = useState<QuerySnapshot>();

  React.useEffect(() => {
    let unsub = onSnapshot(query,(snap)=>{
      setLoading(false)
      !snap.empty && setData(snap)
    })
    return () => {
      unsub()
    };
  }, []);

  return { loading, data };
}
