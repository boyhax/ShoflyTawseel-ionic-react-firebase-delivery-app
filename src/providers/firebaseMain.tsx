import  { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, 
  DocumentData, 
  DocumentSnapshot, 
  getDoc, getFirestore, query, serverTimestamp, setDoc, 
   Timestamp, 
   updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from "firebase/auth";
import { userProfile } from './globalsProvider';
import { db } from '../App';

export type userInfo={
  name:string,
  photoURL:string,
  phoneNumber:string|""
}

export type ApplicationProps ={
  byUser:string,
  forOrder:string,
  forUser:string,
  isAccepted:boolean,
  isDone:boolean,
  timeAccepted:any,
  timeDone:any,
  timeSend:any,
}
export type ApplicationInfo={
  id:string,
  byUser:string,
  time:Date
}
export type OrderReportInfo={
  byUser:string,
  time:Date,
  why:string,
  id:string
}
export type OrderReportProps={
  byUser:string,
  time:Date,
  why:string,
  OrderId:string
}
export type orderProps={
  uid:string,
  from:string,
  to:string,
  time:any,
  number:string,
  comment:string|undefined|null,
  id?:string,
  reports:OrderReportInfo[],
  applications:ApplicationInfo[]

}
export async function getTripCard(id:String){
    var _data:any
    await getDoc(doc(getFirestore(),"orders/"+id)).then((data)=>{
      _data =data
    },(err:object)=>{
      console.log(err)
      _data = null
    })
    return _data
  }
  export async function updateTripCard(id:String,data:{}){
    updateDoc(doc(getFirestore(),"orders/"+id),data)
  }

  export function makeApplicationPropsFromDoc(doc:DocumentSnapshot):ApplicationProps{
    let d = doc.exists()?doc.data():{}
    return {
      byUser:d.byUser,
      forOrder:d.forOrder,
      forUser:d.forUser,
      isAccepted:d.isAccepted,
      isDone:d.isDone,
      timeAccepted:d.timeAccepted,
      timeDone:d.timeDone,
      timeSend:d.timeSend,
    }
  }
export function makeUSerInfoFromDoc(s:DocumentSnapshot):userInfo{
  let d = s.exists()?s.data():{}
    return{
      name:d.name,
      phoneNumber:d.phoneNumber,
      photoURL:d.photoURL
    }
  }
  export function makeOrderFromDoc(orderDocSnap:DocumentSnapshot<DocumentData>):orderProps {
    const o = orderDocSnap.exists()?orderDocSnap.data():{}
    return{
    uid:o.uid,
    from:o.from,
    to:o.to,
    time:o.time,
    number:o.number,
    comment:o.comment,
    id:orderDocSnap.id,
    reports:o.reports?o.reports:[],
    applications:o.applications?o.applications:[]
  }

}
  
  export async function addNewTripCard(data:orderProps){
    var state:any=false
    try {
      const newOrderRef = doc(collection(getFirestore(), "orders"));
      await setDoc(newOrderRef, {id:newOrderRef.id,...data});
      state = true
    } catch (error) {
      console.log(error)
      state = false
    }
    return state
  }
export async function getProfile(uid:string,callback:(profile:any)=>void=(c)=>{}) {
   const res = await getDoc(doc(getFirestore(),"users/"+uid))
   callback(res)
  return res
}
export async function updateUserProfile(uid:any,data:any){
  
    return updateDoc(doc(db,"users/"+uid),data)
  
}
export async function profileExist(uid:string){
  return await (await getProfile(uid)).exists()
}
export function createNewProfile(uid:any,data:any){
    const col = doc(getFirestore(),"users/"+uid)
     const d = setDoc(col,data).then((d)=>{
console.log('new profile created :>> ', d);
  alert("تم تاكيد معلومات الحساب شكرا")
    },(err)=>{
      console.log('err :>> ', err);
    })
    return d
}
export const reportOrder=async(order:orderProps,why:string="")=>{
  const uid = getAuth().currentUser?.uid
  var userReport =order.reports.find((v)=>{return v.byUser ===uid})
  if(!!userReport ){
    alert("already reported");
    return;
  }
  else{
    const report:OrderReportProps={
      byUser:uid!,
      time:new Date(),
      why:why,
      OrderId:order.id!
    } 
     const newDoc = await addDoc(collection(db,"ordersReports"),report)
     const reportInfo:OrderReportInfo={
      byUser:uid!,
      time: new Date(),
      id:newDoc.id,
      why:why
     }
    return updateDoc(doc(db,"orders",order.id!),{
      reports:arrayUnion(reportInfo)
    })
  }    
}
export async function deleteOrder(order:orderProps) {
  deleteDoc_("orders/"+order.id)

}
export async function deleteDoc_(path:string) {
   await deleteDoc(doc(getFirestore(),path))
  console.log(' deleted doc path :>> ',path);

}
export async function isReportedBy(userUID:string,docUID:string) {
  const reports = await getOrderReports(docUID)
  if(!reports ===undefined){
    console.log('reports :>> ', reports);
    reports.forEach((value:any) => {
      if(value.by === userUID){
        return true
      }
    })
    return false
  }
  return true
}
async function getOrderReports(id:string){
  const data = await getDoc(doc(getFirestore(),"orders/"+id))
  
  return data.exists()?data.data().reports!?data.data().reports:[]:undefined
}
export async function applyForCard(UserUID:string,cardUID:string,orderOwner:string) {
  let timeNow = new Date()
  const newApplication:ApplicationProps = {
    timeSend:timeNow,
    forOrder:cardUID,
    forUser:orderOwner,
    byUser:UserUID,
    isAccepted:false,
    isDone:false,
    timeAccepted:timeNow,
    timeDone:timeNow,
      };
      try {
        let d =  await addDoc(collection(db,"ordersApplications"),newApplication)
        
        let info :ApplicationInfo={
          byUser:UserUID,
          id:d.id,
          time:timeNow,
        }
        var res = await updateDoc(doc(getFirestore(),"orders/"+cardUID),
                {"applications":arrayUnion(info)})
      } catch (error) {
        console.log('error on add applictaion to order ${cardUID} : :>> '," error :", error);
      }
  
  
  return res
}
const avatarPLaceholder=require("../assets/avatarPlaceHolder.png")
export function getUserInfoPlaceHolder() {
  let info :userInfo={
    name:"nnnn nnnn",
    phoneNumber:"*** *******",
    photoURL:avatarPLaceholder,
  }
  return info
}
export async function getApplicationsToOrder(cardUID:string) {
  const res = await query(collection(getFirestore(),"ordersApplications/"+cardUID+"/col"))
  if (!!res){
    return res
  }
  return []
}
export async function removeApplicationToOrder(info:ApplicationInfo,orderDoc:DocumentSnapshot<DocumentData>) {
  const res = await updateDoc(orderDoc.ref,
  {"applications":arrayRemove(info)})
  return res
}

export function is_user_applied_to_card(UserUID:string,order:orderProps){
  return !!order.applications.find((value)=>{return value.byUser === UserUID})
}

export function intersection(a:Array<any>,b:Array<any>){
  var filteredArray = a.filter(function(n) {
    return b.indexOf(n) !== -1;
});
return filteredArray
}