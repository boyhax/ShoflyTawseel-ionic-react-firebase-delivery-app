import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  documentId,
  DocumentSnapshot,
  GeoPoint,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { geocodeByLatLng } from "react-google-places-autocomplete";

import "firebase/compat/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  ApplicationInfo,
  ApplicationProps,
  newOrderProps,
  orderFilter,
  orderProps,
  OrderReportInfo,
  OrderReportProps,
  userInfo,
  UserProfile,
} from "../types";
import { initializeApp } from "firebase/app";
import { Config } from "../config";
import geoFirestore from "./geofirestore";
import { Store } from "pullstate";

export const userOrdersStore = new Store<any[]>([]);
export const userApplicationsStore = new Store<any[]>([]);
export const userReportsStore = new Store<any[]>([]);
export const userStore = new Store<{
  user: User | null;
  profile: UserProfile | null;
}>({
  user: null,
  profile: null,
});

class firebaseClass {
  constructor() {
    console.log("firebase Class");
    initializeApp(Config());

    this.db = getFirestore();
    onAuthStateChanged(getAuth(), (user) => {
      this.user = user;
      userStore.update((s) => {
        s.user = user;
      });
      console.log('user id :>> ', user && user.uid);

      user && this.token && this.updateToken();
    });
    // getDocs(query(collection(this.db,'orders'))).then((snap)=>{
    //   snap.forEach((doc)=>{
    //     doc.data().geo || deleteDoc(doc.ref).then((d)=>console.log('doc deleted'+doc.id))
    //   })
    // })
  }
  db;
  userOrders: DocumentSnapshot[] = [];
  userApplications: DocumentSnapshot[] = [];
  userReports: DocumentSnapshot[] = [];
  user: User | null = null;
  token: string | null = null;
  SubscribeUserLists = false;
async getUserInfo(uid:string){
  return getDoc(doc(this.db,'users/'+uid))
}
  async removeApplicationToOrder(orderID: string) {
    const application = mydb.userApplications.find(
      (v) => v.exists() && v.data().forOrder === orderID
    );
    var res;
    application &&
      application.exists() &&
      (res = await deleteDoc(application.ref));
    return res;
  }

  updateToken() {
    setDoc(doc(this.db, "fcmTokens" + this.user?.uid), {
      token: this.token,
    }).then((v) => {
      console.log("token updated");
    });
  }
  setUserToken(token: string) {
    this.token = token;
  }
  unSubscripeUserList() {
    this.SubscribeUserLists = false;
  }
  subscripeUserList(userId: string) {
    this.SubscribeUserLists = true;
    subscripeUserOrders(userId, (snap) => {
      this.userOrders = snap.docs;
      userOrdersStore.update((s) => this.userOrders);
      return !this.subscripeUserList;
    });
    subscripeUserApplications(userId, (snap) => {
      this.userApplications = snap.docs;
      userApplicationsStore.update((s) => this.userApplications);
      return !this.subscripeUserList;
    });
    subscripeUserReports(userId, (snap) => {
      this.userReports = snap.docs;
      userReportsStore.update((s) => this.userReports);
      return !this.subscripeUserList;
    });
  }
  is_user_applied_to_card(userid: string, orderid: string) {
    const res = !!this.userApplications.find((v) => {
      return v.exists() && v.data().forOrder === orderid;
    });
    return new Promise<boolean>((resolve, rej) => {
      resolve(res);
    });
  }
}
export const mydb = new firebaseClass();

export const db = mydb.db;
export function geoToLatlng(geo: GeoPoint) {
  return {
    lat: geo.latitude,
    lng: geo.longitude,
  };
}
export async function uploadNewOrder(o: newOrderProps) {
  console.log("to upload order :>> ", o);

  const newO: Partial<orderProps> = {
    geo: o.geo,
    urgent: o.urgent || false,
    from: "",
    to: "",
    uid: getAuth().currentUser?.uid!,
    time: serverTimestamp(),
    type: o.type || "smallObjects",
    comment: o.comment || "no comment",
    address: o.address,
  };
  const doc = await addDoc(collection(db, "orders"), newO);
  const from = geoFirestore.addGeo(doc.id, geoToLatlng(o.geo.from), true);
  const to = geoFirestore.addGeo(doc.id, geoToLatlng(o.geo.to), false);

  return Promise.all([to, from]);
}
export async function setUserImage(
  photo: Blob,
  fileName: string,
  userid?: string
) {
  const sref = ref(getStorage(), fileName);
  const p = await uploadBytes(sref, photo);

  const url = await getDownloadURL(sref);


  if (userid && url) {
    await updateUserProfile(userid, { photoURL: url });
  } else {
    await updateUserProfile(getAuth().currentUser?.uid, { photoURL: url });
  }
}
export function getUserReports(id: String) {
  return getDocs(
    query(collection(db, "ordersReports"), where("from", "==", id))
  );
}
export function subscripeUserReports(
  id: String,
  result: (snap: QuerySnapshot<DocumentData>) => boolean
) {
  const unsubHere = onSnapshot(
    query(collection(db, "ordersReports"), where("from", "==", id)),
    (snap) => {
      let unsub = result(snap);
      unsub && unsubHere();
    }
  );
}
export function subscripeUserApplications(
  id: String,
  result: (snap: QuerySnapshot<DocumentData>) => boolean
) {
  const unsubHere = onSnapshot(
    query(collection(db, "ordersApplications"), where("byUser", "==", id)),
    (snap) => {
      let unsub = result(snap);
      unsub && unsubHere();
    }
  );
}
export function subscripeUserOrders(
  id: String,
  result: (snap: QuerySnapshot<DocumentData>) => boolean
) {
  const unsubHere = onSnapshot(
    query(collection(db, "orders"), where("uid", "==", id)),
    (snap) => {
      let unsub = result(snap);
      unsub && unsubHere();
    }
  );
}

export async function getOrders(
  filter?: orderFilter,
  _limit?: number,
  fromDoc?: DocumentSnapshot
) {
  var qu = query(collection(db, "orders/"));
  if (filter) {
    if (filter.userID) {
      if(filter.userID ==='notself'){
        !!mydb.user&& (qu = query(qu,orderBy('uid'), where("uid", "!=", mydb.user.uid)));

      }else{
        qu = query(qu,orderBy('uid'), where("uid", "==", filter.userID));

      }
    }
    if (filter.from) {
      qu = query(qu, where("from", "==", filter.from));
    }
    if (filter.to) {
      qu = query(qu, where("to", "==", filter.to));
    }
    
    if (filter?.limit) {
      qu = query(qu, limit(filter?.limit));
    }
  }

  qu = query(qu, orderBy("time", "desc"));

  if (fromDoc) {
    qu = query(qu, startAfter(fromDoc));
  }
  return await getDocs(qu);
}

export async function getOrderById(id: String) {
  var qu = doc(db, "orders/" + id);

  return getDoc(qu);
}

export function makeApplicationPropsFromDoc(
  doc: DocumentSnapshot
): ApplicationProps {
  let d = doc.exists() ? doc.data() : {};
  return JSON.parse(JSON.stringify(d));
  // {
  //   byUser: d.byUser,
  //   forOrder: d.forOrder,
  //   forUser: d.forUser,
  //   isAccepted: d.isAccepted,
  //   isDone: d.isDone,
  //   timeAccepted: d.timeAccepted,
  //   timeDone: d.timeDone,
  //   timeSend: d.timeSend,
  // };
}
export function makeUSerInfoFromDoc(s: DocumentSnapshot): userInfo {
  let d = s.exists() ? s.data() : {};
  return {
    name: d.name,
    phoneNumber: d.phoneNumber,
    photoURL: d.photoURL,
  };
}
export function getGeoCode(geoPoint: GeoPoint) {
  return new Promise<google.maps.GeocoderResult | "">(
    async (resolve, reject) => {
      try {
        const list = await geocodeByLatLng(geoToLatlng(geoPoint));
        console.log('get geocode :>> ', list);
        resolve(list ? list[0] : "");
      } catch (error) {
        reject(error);
      }
    }
  );
}
export function makeOrderFromDoc(
  orderDocSnap: DocumentSnapshot<DocumentData>
): orderProps {
  const o = orderDocSnap.exists() ? orderDocSnap.data() : {};

  return {
    id:orderDocSnap.id,
    geo: o.geo,
    urgent: o.urgent,
    type: o.type,
    uid: o.uid,
    from: o.from,
    to: o.to,
    time: o.time,
    comment: o.comment,
    address: o.address,
  };
}
export function UserProfileFromDoc(doc: DocumentSnapshot): UserProfile {
  const d = doc.data();
  return {
    name: d?.name,
    phoneNumber: d?.phoneNumber,
    photoURL: d?.photoURL,
    devloper: !!d?.devloper,
  };
}

export async function getProfile(
  uid: string,
  callback: (profile: any) => void = (c) => {}
) {
  const res = await getDoc(doc(db, "users/" + uid));
  callback(res);
  return res;
}
export async function updateUserProfile(uid: any, data: any) {
  return updateDoc(doc(db, "users/" + uid), data);
}
export async function profileExist(uid: string) {
  return await (await getProfile(uid)).exists();
}
export async function createNewProfileForThisUser(
  name: string,
  phoneNumber: string,
  email: string,
  photoURL: string
) {
  const uid = getAuth().currentUser?.uid;
  const profile: UserProfile = {
    name: name,
    phoneNumber: phoneNumber,
    email: email,
    photoURL: photoURL,
    devloper: false,
  };
  const dref = doc(getFirestore(), "users", uid!);
  const d = setDoc(dref, profile).then(
    (d) => {
      console.log("new profile created :>> ", d);
    },
    (err) => {
      console.log("err :>> ", err);
    }
  );
  return d;
}

export function UpdateProfileForThisUser(data: any) {
  const uid = getAuth().currentUser?.uid;

  return updateUserProfile(uid!, data);
}
export const reportOrder = async (order: string, why: string ) => {
  const uid = getAuth().currentUser?.uid;
  var userReport = mydb.userReports.find((v: any) => {
      return v.byUser === uid;
    })
  
  if (!!userReport) {
    alert("already reported");
    return;
  } else {
    const report: OrderReportProps = {
      byUser: uid!,
      time: serverTimestamp(),
      why: why,
      OrderId: order,
    };
      await addDoc(collection(db, "ordersReports"), report);
    
  }
};
export function deleteOrder(id:string) {
  return deleteDoc(doc(db,'orders/'+id));
}
export async function deleteDoc_(path: string) {
  await deleteDoc(doc(getFirestore(), path));
  console.log(" deleted doc path :>> ", path);
}
export async function isReportedBy(userUID: string, docUID: string) {
  const reports = await getOrderReports(docUID);
  if (!reports === undefined) {
    console.log("reports :>> ", reports);
    reports.forEach((value: any) => {
      if (value.by === userUID) {
        return true;
      }
    });
    return false;
  }
  return true;
}
async function getOrderReports(id: string) {
  const data = await getDoc(doc(getFirestore(), "orders/" + id));

  return data.exists()
    ? data.data().reports!
      ? data.data().reports
      : []
    : undefined;
}
export async function applyForCard(
  UserUID: string,
  cardUID: string,
  orderOwner: string
) {
  let timeNow = new Date();
  const newApplication: Partial<ApplicationProps> = {
    timeSend: timeNow,
    forOrder: cardUID,
    forUser: orderOwner,
    byUser: UserUID,
    isAccepted: false,
    isDone: false,
    timeAccepted: timeNow,
    timeDone: timeNow,
  };
  var res
  try {
    res =  addDoc(collection(db, "ordersApplications"), newApplication);

  } catch (error) {
    console.log("error on add applictaion to order ${cardUID} : :>> ",error);
  }
  return  Promise.all([res]);
}
export const avatarPLaceholder = require("../assets/avatarPlaceHolder.png");
export function getUserInfoPlaceHolder() {
  let info: userInfo = {
    name: "Nick Name",
    phoneNumber: "*** *******",
    photoURL: avatarPLaceholder,
  };
  return info;
}
export async function getApplicationsToOrder(cardUID: string) {
  const res = await query(
    collection(getFirestore(), "ordersApplications/" + cardUID + "/col")
  );
  if (!!res) {
    return res;
  }
  return [];
}

export function intersection(a: Array<any>, b: Array<any>) {
  var filteredArray = a.filter(function (n) {
    return b.indexOf(n) !== -1;
  });
  return filteredArray;
}
export const hands_up = require("../assets/hands-up.png");
