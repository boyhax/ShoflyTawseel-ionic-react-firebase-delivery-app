import { LatLng } from "leaflet";
import { Store } from "pullstate";
import { mydb } from "../api/firebaseMain";
import { driverData, UserProfile } from "../types";
import { User } from "firebase/auth";

interface Props {
  user: User | null | undefined;
  profile: UserProfile | undefined | null;
  address: {
    geo: LatLng;
    name: string;
  } | null;
  driver: driverData | null;
}
const initialProps: Props = {
  user: undefined,
  profile: undefined,
  address: null,
  driver: null,
};

export const userStore = new Store(initialProps);



export function useProfile() {
  async function setStatus(state: any) {
    await mydb.updateProfile({ status: state });
    userStore.update((s) => {
      s.profile!.status = state;
    });
  }
  return { setStatus };
}
