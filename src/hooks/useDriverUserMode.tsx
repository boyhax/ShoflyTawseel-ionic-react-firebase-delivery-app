import { setupBatch, Store } from "pullstate";
import { Preferences } from "@capacitor/preferences";
import { useEffect } from "react";

const modeStore = new Store({
  driverMode: false,
});
// Preferences.get({ key: "driverMode" })
//   .then((v) =>
//     v.value === "true" ? true : v.value === "false" ? false : undefined
//   )
//   .then((v) => {
//     v === undefined && Preferences.set({ key: "driverMode", value: "false" });
//     v !== undefined &&
//       modeStore.update((s) => {
//         s.driverMode = v;
//       });
//   })
//   .catch((e) => console.log(e));

export default function useDriverUserMode() {
  const { driverMode } = modeStore.useState();

  function toggleMode() {
    Preferences.set({
      key: "driverMode",
      value: driverMode ? "false" : "true",
    });

    modeStore.update((s) => {
      s.driverMode = !s.driverMode;
    });
  }
  return { driverMode, toggleMode };
}
