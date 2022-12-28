import { Network } from "@capacitor/network";
import { useEffect, useState } from "react";

const useOnline=()=>{
    const [online,setOnline] = useState<boolean>(false)
    useEffect(() => {
        CurrentNetworkStatus()
        return unsub
    }, []);
    function unsub(){
        Network.removeAllListeners();
    }
    const CurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      setOnline(status.connected)
      Network.addListener('networkStatusChange', status => {
        setOnline(status.connected)
      });
    }
    return {online}
  }
  export default useOnline