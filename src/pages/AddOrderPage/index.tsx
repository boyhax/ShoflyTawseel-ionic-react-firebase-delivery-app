import { useIonAlert } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import * as React from 'react';

import { createContext,useContext } from 'react';
import { uploadNewOrder } from '../../providers/firebaseMain';
import { useGlobals } from '../../providers/globalsProvider';
import { keyValue, newOrderProps, OrderCatagorie,
     OrderCatagories,orderProps } from '../../types';
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

const OrderContext = createContext(initialProps);


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
export const useOrderContext=()=>{
    return useContext(OrderContext)
};

export const useNewOrder=()=>{
    const {order,loading,update,step} = useOrderContext()

    const [submitted,setSubmitted] = React.useState(false)

    const {urgent ,from,to,comment,geoLocation,type}= order

    function setUrgent(b:boolean){

    }
    
    const setLoading = (b:boolean)=>{
        update({loading:b})
    }

    
    const setStep = (b:number)=>{
        update({step:b})
    }
    const stepNext=()=>{
        update({step:step+1})
    };
    const stepBack=()=>{
        update({step:step-1})

    }
    const submitOrder = async () => {
       
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
      const values = {order,urgent,loading,submitOrder,step,stepBack,
        stepNext,setUrgent,submitted}

    return values
}


export default Provider

class Order{
    greeting:string
    constructor(greeting:string){
        this.greeting = greeting
    }
    greet(){
          console.log(this.greeting)  
    }
    update(d:any){
            
        this.greeting = d
    } 
    
      
}
const d = new Order("hellll")
d.greet()
d.update("ddd")
d.greet()