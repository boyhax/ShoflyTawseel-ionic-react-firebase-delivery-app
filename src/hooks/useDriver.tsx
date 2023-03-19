import mydb from "../providers/firebaseMain";
import { userStore } from "../Stores/userStore";
import useMounted from "./useMounted";

export function useDriver() {
  const { driver } = userStore.useState();
  const { mounted } = useMounted();
  
  async function setStatus(state: any) {
    await mydb.updateDriver({ working: state });
    userStore.update((s) => {
      s.driver!.working = state;
    });
  }
  //  mydb.getDriverData()
  function toggleStatus() {
    driver &&
      mounted &&
      setStatus(!driver.working );
  }

  return { driver, toggleStatus, setStatus };
}
