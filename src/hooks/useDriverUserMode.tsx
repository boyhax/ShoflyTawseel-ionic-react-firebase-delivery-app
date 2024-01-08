import { Store } from "pullstate";
import { storage } from "../App";

export const driverModeStore = new Store({
  driverMode: false,
});


export default function useDriverUserMode() {
  const { driverMode } = driverModeStore.useState();

  function toggleMode() {
    storage.set("driverMode", !driverMode);
    driverModeStore.update((s) => {
      s.driverMode = s.driverMode?false:true;
    });
  }
  return { driverMode, toggleMode };
}
