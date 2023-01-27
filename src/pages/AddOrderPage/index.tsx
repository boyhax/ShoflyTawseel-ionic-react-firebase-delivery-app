import { useIonToast } from "@ionic/react";
import { Store } from "pullstate";
import * as React from "react";
import { useHistory } from "react-router";

import { uploadNewOrder } from "../../providers/firebaseMain";
import { newOrderProps, orderProps } from "../../types";
import AddOrderPage from "./AddOrderPage";
interface Props {
  step: number;
  loading: boolean;
  order: Partial<newOrderProps>  ;
}
const initialProps: Props = {
  step: 0,
  loading: false,
  order: {  },
};
export const newOrderStore = new Store(initialProps);

export function useNewOrder(){

  const navigate = useHistory();
  const [present] = useIonToast();

  function setOrder(order:any){
    newOrderStore.update((s) => {
      s.order = order;
    });
  }
  async function uploadOrder(order:newOrderProps){

      newOrderStore.update((s) => {
        s.loading = true;
      });

      console.log('order :>> ', order);
      
      try {
        await uploadNewOrder(order);
        present({ message: "Order submitted seccessfully ", duration: 1000 });
        navigate.push("/");

      } catch (error) {

        console.log('error from new order :>> ', error );
        present({ message: "Sorry some issue happen.. please try Again",duration: 1000 });
      }

      newOrderStore.update((s) => {
        s.loading = false;
      });
    
  }
  function reset(){
    newOrderStore.update(s=>{s.order={};s.step=0;s.loading=false})
  }

  return{reset,setOrder,uploadOrder,...newOrderStore.useState()}
}


export default AddOrderPage;
