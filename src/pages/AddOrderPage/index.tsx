import { useIonToast } from "@ionic/react";
import { LatLng } from "leaflet";
import { Store } from "pullstate";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import { useHistory } from "react-router";

import { uploadNewOrder } from "../../providers/firebaseMain";
import { newOrderProps } from "../../types";
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
export function updateGeo(data:any){
  newOrderStore.update(s=>{s.order.geo = {...s.order.geo,...data}})
}
export async function updateFromTo(from:boolean,point:LatLng){
  var codeResult = await geocodeByLatLng(point)
  var data = codeResult? codeResult[0].formatted_address:''
  newOrderStore.update(s=>{
    from?s.order.from = data:s.order.to = data})
}
export function updateStep(to:number){
  newOrderStore.update(s=>{s.step = to})
}
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
