import { useIonToast } from "@ionic/react";
import { Store } from "pullstate";
import * as React from "react";

import { uploadNewOrder } from "../../providers/firebaseMain";
import { newOrderProps, orderProps } from "../../types";
import AddOrderPage from "./AddOrderPage";
interface Props {
  step: number;
  loading: boolean;
  order: newOrderProps |any ;
  submit: Promise<void>|any,
  finish:boolean
}
const initialProps: Props = {
  finish:false,
  step: 0,
  submit:()=>{},
  loading: false,
  order: { to: '', from: '' },
};
export const newOrderStore = new Store(initialProps);



export default AddOrderPage;
