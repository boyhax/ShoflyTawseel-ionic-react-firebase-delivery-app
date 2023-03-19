import { setupBatch, Store } from "pullstate";
import { Preferences } from "@capacitor/preferences";
import { useEffect } from "react";

export const driverModeStore = new Store({
  driverMode: false,
});


export default function useDriverUserMode() {
  const { driverMode } = driverModeStore.useState();

  function toggleMode() {

    driverModeStore.update((s) => {
      s.driverMode = s.driverMode?false:true;
    });
  }
  return { driverMode, toggleMode };
}
