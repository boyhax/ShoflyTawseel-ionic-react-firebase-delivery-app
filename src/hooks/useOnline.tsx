import { Network } from "@capacitor/network";
import { Store } from "pullstate";
import { useEffect, useState } from "react";

const networkStore = new Store({
  isOnline:false,
  connectionType:'wifi'
})
class onlineCheck{
  constructor(){
    this.CurrentNetworkStatus()
    Network.addListener('networkStatusChange', status => {
      this.CurrentNetworkStatus()
    });
  }
  CurrentNetworkStatus = async () => {
     Network.getStatus().then((d)=>{
      networkStore.update((s)=>{s.isOnline=d.connected;s.connectionType = d.connectionType})
     },(err)=>{
      console.log('err :>> ', err);
     });
    
  }

}
const useOnline=()=>{
    const {isOnline ,connectionType} =networkStore.useState()
    
    
    return { isOnline,connectionType}
  }
  const d = new onlineCheck()
  export default useOnline