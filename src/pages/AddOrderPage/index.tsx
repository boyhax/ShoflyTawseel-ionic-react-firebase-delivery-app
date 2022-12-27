import { useIonAlert } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import * as React from 'react';

import { createContext,useContext } from 'react';
import { uploadNewOrder } from '../../providers/firebaseMain';
import { useGlobals } from '../../providers/globalsProvider';
import { keyValue, newOrderProps, OrderCatagorie, OrderCatagories,orderProps } from '../../types';
import AddOrderPage from './AddOrderPage';

interface Props{
    step:number,
    loading:boolean,
    order:newOrderProps,
    update:(d:any)=>void
}
const initialProps:Props={
    step:1,
    loading:false,
    order:{to:{key:'',value:''},from:{key:'',value:''}},
    update:(d:any)=>{},

}

const OrderContext = createContext<Props>(initialProps);

export const useOrderContext=()=>{

    return useContext(OrderContext)
};
export const useNewOrder=()=>{
    const {order,loading,update,step} = useOrderContext()

    const [to,setTo] = React.useState<keyValue>()
    const [from,setFrom] = React.useState<keyValue>()
    const [comment,setComment] = React.useState("")
    const [submitted,setSubmitted] = React.useState(false)
    const [type,setType] = React.useState<OrderCatagorie>('SmallObjects')
    const urgent = order.urgent
    function setUrgent(b:boolean){

    }
    const setStep = (b:number)=>{
        update({loading:b})
    }
    const setLoading = (b:boolean)=>{
        update({loading:b})
    }

    const [presentAlert] = useIonAlert()

    const stepNext=()=>{
        update({step:step+1})
    };
    const stepBack=()=>{
        update({step:step-1})

    }
    const submitOrder = async () => {
    
        // if (!user) {
        //   presentAlert({
        //     message: 'please Sign In First',
        //     animated: true,
        //     buttons: [{
        //       text: 'Ok', handler: (value) => {
        //       },
        //     }]
        //   })
        // }
       
        setLoading(true)
        
        try {
            if(from && to  ){
                await uploadNewOrder({
                    from:from,to:to,
                    comment:order.comment,type:order.type,
                    urgent:order.urgent
                  })
            }
          
          setSubmitted(true)
    
        } catch (error) {
          console.log('error submitiing order :>> ', error);
        }
        setLoading(false)
    
      }
      const values = {urgent,loading,submitOrder,step,stepBack,
        stepNext,setUrgent}

    return values
}
const Provider= (p:any)=>{
    const [props,setProps] = React.useState(initialProps)
    const update = (d:Object)=>{
        setProps({...props,...d})
    }
    const values = {...props,update}
    
    return<OrderContext.Provider value={values}>
        <AddOrderPage></AddOrderPage>
    </OrderContext.Provider>
} 

export default Provider