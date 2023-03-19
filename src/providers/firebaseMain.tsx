import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
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
  driverData,
  DriverStatus,
  newOrderProps,
  orderFilter,
  orderProps,
  OrderReportInfo,
  OrderReportProps,
  OrderStatus,
  userInfo,
  UserProfile,
} from "../types";
import { initializeApp } from "firebase/app";
import { Config } from "../config";
import geoFirestore from "./geofirestore";
import { Store } from "pullstate";
import { b64toBlob } from "../hooks/usePhoto";
import L, { LatLng } from "leaflet";
import { userStore } from "../Stores/userStore";
import { clear } from "console";
import chatStore, { ChatProps, MessageProps } from "../Stores/chatStore";
import { getAcendingString } from "../components/utlis/AcendingString";
import { TT } from "../components/utlis/tt";
import { getFunctions, HttpsCallable, httpsCallable } from "firebase/functions";
import { FCM, FCMPlugin } from "@capacitor-community/fcm";
import { TokenStore } from "./pushFCM";
import { PushNotificationSchema } from "@capacitor/push-notifications";
import { AnyARecord } from "dns";

export const userOrdersStore = new Store<any[]>([]);
export const userApplicationsStore = new Store<any[]>([]);
export const userReportsStore = new Store<any[]>([]);
export const userNotificatonsStore = new Store<any[]>([]);

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
      user && this.updateToken();
      console.log("user id :>> ", user && user.uid);
      if (!user) {
        this.unSubscripeUserList();
      } else {
        this.subscripeUserList();
      }
      // user && this.token && this.updateToken();
    });
    // this.sendPush = httpsCallable(getFunctions(), "sendMessage");
  }
  db;
  userOrders: DocumentSnapshot[] = [];
  userApplications: DocumentSnapshot[] = [];
  userReports: DocumentSnapshot[] = [];
  userNotifications: DocumentSnapshot[] = [];

  user: User | null = null;
  profile: UserProfile | undefined = undefined;
  driver: driverData | undefined = undefined;
  token: string | null = null;
  SubscribeUserLists = false;
  unSubList: any[] = [];
  sendPush: any = async (message: any) => {
    addDoc(collection(this.db, "push"), message)
      .then((s) => console.log("push sent :>> ", s))
      .catch((s) => console.log("push error :>> ", s));
  };

  async getUserInfo(uid: string) {
    return getDoc(doc(this.db, "usersInfo/" + uid)).then(
      (doc) => doc.data() as userInfo
    );
  }
  subscribeProfile() {
    const uid = this.user?.uid;
    const ref = doc(this.db, "users/" + uid);
    getDoc(ref).then((snap)=>{
      if(!snap.exists()){
        this.hundleNoProfileCreatedYet();
        userStore.update((s) => {
          s.profile = null;
        });
      }else{
        userStore.update((s) => {
          s.profile = UserProfileFromDoc(snap);
        });
      }
    })
    return onSnapshot(ref, (doc) => {
      var profile: any = null;
      if (doc.exists()) {
        profile = UserProfileFromDoc(doc);
      }else{
        this.hundleNoProfileCreatedYet();
        userStore.update((s) => {
          s.profile = null;
        });
      }
      
  
    });
  }
  async hundleNoProfileCreatedYet() {
    const user = this.user!;
    const name = user.displayName || "User" + user.uid.slice(0, 5);
    const number: string = user.phoneNumber || "";
    const email: string = (user.emailVerified && user.email) || "";
    const photo = "https://ui-avatars.com/api/?name=NAME".replace("NAME", name);
    createNewProfileForThisUser(name, number, email, photo);
  }
  subscribeDriver() {
    const uid = this.user?.uid;
    const ref = doc(this.db, "drivers/" + uid);

    return onSnapshot(ref, (doc) => {
      if (doc.exists()) {
        const driver: driverData = doc.data() as driverData;
        this.driver = driver;
        userStore.update((s) => {
          s.driver = driver;
        });
      } else {
        this.driver = undefined;
        userStore.update((s) => {
          s.driver = null;
        });
      }
    });
  }

  imApprovedDriver() {}
  async removeApplicationToOrder(order: orderProps) {
    //unsub driver from order

    updateDoc(doc(this.db, "orders/" + order.id), {
      driver: "",
      status: OrderStatus.Placed,
    });

    this.userApplications = this.userApplications.filter(
      (v) => v.id !== order.id
    );
    userApplicationsStore.update((s) => this.userApplications);
  }

  updateToken() {
    FCM.getToken()
      .then((token) => {
        this.token = token.token;
        TokenStore.update((s) => {
          s.token = token.token;
        });

        setDoc(doc(this.db, "fcmTokens/" + this.user?.uid), {
          token: token,
        })
          .then((v) => {
            console.log("token updated");
          })
          .catch((s) => console.log("token update error :>> ", s));
      })
      .catch((s) => console.log("token error :>> ", s));
  }
  setUserToken(token: string) {
    this.token = token;
  }
  unSubscripeUserList() {
    this.SubscribeUserLists = false;
    this.unSubList.forEach((v) => v());
  }

  subscripeUserList() {
    this.SubscribeUserLists = true;
    var unsub0 = this.subscribeProfile();
    var unsub00 = this.subscribeDriver();
    var unsub1 = subscripeUserOrders(this.user!.uid, (snap) => {
      this.userOrders = snap.docs;
      userOrdersStore.update((s) => this.userOrders);
      return !this.subscripeUserList;
    });

    var unsub2 = subscripeUserApplications((snap) => {
      this.userApplications = snap.docs;
      userApplicationsStore.update((s) => this.userApplications);
      return !this.subscripeUserList;
    });
    var unsub3 = subscripeUserReports(this.user!.uid, (snap) => {
      this.userReports = snap.docs;
      userReportsStore.update((s) => this.userReports);
      return !this.subscripeUserList;
    });
    var unsub4 = subscripeUserNotifications(this.user!.uid, (snap) => {
      this.userNotifications = snap.docs;
      userNotificatonsStore.update((s) => this.userNotifications);
      return !this.subscripeUserList;
    });
    this.subscripeUserChats();
    this.unSubList.push(unsub0, unsub00, unsub1, unsub2, unsub3, unsub4);
  }
  async subscripeUserChats() {
    var ref = collection(this.db, "chats");
    var que = query(ref, where("chaters", "array-contains", this.user?.uid));
    let unsub = onSnapshot(que, (snap) => {
      var chats: any[] = [];
      !snap.empty &&
        (chats = snap.docs.map((v) => {
          return { ...v.data(), id: v.id };
        }));
      chatStore.update((s) => {
        s.chats = chats;
      });
      console.log("chats :>> ", chats);
    });
    this.unSubList.push(unsub);
  }
  async sendMessage(chatId: string, data: Pick<MessageProps, "text" | "data">) {
    if (!this.user) {
      return;
    }
    let message: MessageProps = {
      iconURL:
        this.user?.photoURL ||
        avatarPLaceholder(this.user?.displayName ?? " s t"),
      name: this.user?.displayName || "@@",
      from: this.user!.uid,
      isRead: false,
      time: new Date(),
      ...data,
    };
    addDoc(collection(this.db, "chats/" + chatId + "/messages"), message);
  }
  async makeChatIfUserExist(id: string) {
    console.log("making new chat 0");
    if (!this.user) {
      return;
    }
    console.log("making new chat 1");

    getDoc(doc(this.db, "users/" + id)).then((_doc) => {
      if (_doc.exists()) {
        console.log("making new chat user exist");

        setDoc(
          doc(this.db, "chats/" + getAcendingString([this.user!.uid, id])),
          {
            chaters: [this.user?.uid, id],
          }
        );
        let message: MessageProps = {
          iconURL:
            this.user?.photoURL ||
            avatarPLaceholder(this.user?.displayName ?? " s t"),
          name: this.user?.displayName || "@@",
          data: "",
          from: this.user!.uid,
          text: TT("Hello"),
          isRead: false,
          time: new Date(),
        };
        addDoc(
          collection(
            this.db,
            "chats/" + getAcendingString([this.user!.uid, id]) + "/messages"
          ),
          message
        );
      } else {
        console.log("User not found");
      }
    });
  }
  async uploadPhoto(base64photo: string, name: string) {
    const blob = b64toBlob(base64photo, `image/${name}`, 512);
    const sref = ref(getStorage(), name);
    const p = await uploadBytes(sref, blob);
    const url = await getDownloadURL(sref);
    return url;
  }
  async uploadFile(file: File) {
    const sref = ref(getStorage(), `avatar/${file.name}`);
    const p = await uploadBytes(sref, file);
    const url = await getDownloadURL(sref);
    return url;
  }
  updateProfile(profile: Partial<UserProfile>) {
    return updateDoc(doc(this.db, "users/" + this.user?.uid), profile);
  }

  async submitDriverApplication(values: any) {
    return setDoc(doc(this.db, "drivers/" + this.user?.uid), {
      ...values,
      status: "pending",
    })
      .then((s) => true)
      .catch((e) => false);
  }
  async getDrivers(
    values: { from: any; status?: "pending" | "active" | "inactive" },
    onlastDoc?: any
  ) {
    var q = query(collection(this.db, "drivers"), limit(10));
    q = query(q, where("status", "==", values.status || "active"));

    // q = query(q,orderBy("time", "desc"))
    values.from && (q = query(q, startAfter(values.from)));
    const res = await getDocs(q);
    !res.empty && onlastDoc(res.docs[res.docs.length - 1]);
    return res.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as driverData;
    });
  }
  async ApproveDriver(id: string) {
    console.log("driver approved =>", id);
    return updateDoc(doc(this.db, "drivers/" + id), {
      status: DriverStatus.active,
    });
  }
  async getDriverData() {
    const res = await getDoc(doc(this.db, "driver/" + this.user?.uid));
    return res.data()?.driverData;
  }
  async applyForCard(order: orderProps) {
    const a = updateDoc(doc(this.db, "orders/" + order.id), {
      status: OrderStatus.DriverAsigned,
      driver: this.user?.uid,
    });
    const b = getDocs(
      query(collection(this.db, "ordersGeoFrom"), where("id", "==", order.id))
    ).then((v) => {
      v.forEach((doc) => {
        updateDoc(doc.ref, { status: OrderStatus.DriverAsigned });
      });
    });

    return Promise.all([a, b]);
  }
  async deleteOrder(order: orderProps) {
    this.userOrders = this.userOrders.filter((v) => v.id !== order.id);
    userOrdersStore.update((s) => this.userOrders);
    this.deleteGeos(order);
    return deleteDoc(doc(this.db, `orders/${order.id}`)).then((v) => {
      console.log("order deleted ", order.id);
    });
  }
  async deleteGeos(order: orderProps) {
    getDocs(
      query(collection(this.db, "ordersGeoFrom"), where("id", "==", order.id))
    ).then((v) => {
      v.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });
    getDocs(
      query(collection(this.db, "ordersGeoTo"), where("id", "==", order.id))
    ).then((v) => {
      v.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });
  }
  async updateDriver(data: Partial<driverData>) {
    return updateDoc(doc(this.db, `drivers/${this.user!.uid}`), data)
      .then((s) => true)
      .catch((e) => false);
  }
}
export const mydb = new firebaseClass();
export default mydb;

export const db = mydb.db;
export function geoToLatlng(geo: GeoPoint): LatLng {
  return L.latLng(geo.latitude, geo.longitude);
}
export async function uploadNewOrder(o: newOrderProps) {
  var docref, from, to, id;
  try {
    const newO = {
      geo: o.geo,
      urgent: o.urgent || false,
      from: o.from ?? "",
      to: o.to ?? "",
      uid: getAuth().currentUser?.uid!,
      time: serverTimestamp(),
      type: o.type || "smallObjects",
      comment: o.comment || "no comment",
      address: o.address ?? { from: "", to: "" },
      driver: "",
      phoneNumber: mydb.user?.phoneNumber! ?? "",
      status: OrderStatus.Placed,
      id: "",
    };
    // docref = await setDoc(doc(db, "orders/" + id), newO);
    docref = await geoFirestore.addOrder(newO);
    updateDoc(doc(db, "orders/" + docref.id), { id: docref.id });
  } catch (error) {
    console.log("new order creation error :>> ", error);
  }
  return docref;
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
  return unsubHere;
}
export function subscripeUserNotifications(
  id: String,
  result: (snap: QuerySnapshot<DocumentData>) => boolean
) {
  const unsubHere = onSnapshot(
    query(collection(db, "push/" + id), orderBy("time", "desc")),
    (snap) => {
      let unsub = result(snap);
      unsub && unsubHere();
    }
  );
  return unsubHere;
}
export function subscripeUserApplications(
  result: (snap: QuerySnapshot<DocumentData>) => boolean
) {
  const uid = getAuth().currentUser?.uid;
  var q = query(collection(db, "orders"), where("driver", "==", uid));
  q = query(q, orderBy("time", "desc"));
  const unsubHere = onSnapshot(q, (snap) => {
    let unsub = result(snap);
    unsub && unsubHere();
  });
  return unsubHere;
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
  return unsubHere;
}

export async function getOrders(
  filter?: orderFilter,
  _limit?: number,
  fromDoc?: DocumentSnapshot
) {
  var qu = query(collection(db, "orders/"));
  if (filter) {
    if (filter.userID) {
      if (filter.userID === "notself") {
        !!mydb.user &&
          (qu = query(qu, orderBy("uid"), where("uid", "!=", mydb.user.uid)));
      } else {
        qu = query(qu, orderBy("uid"), where("uid", "==", filter.userID));
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
        console.log("get geocode :>> ", list);
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
  return { id: orderDocSnap.id, ...orderDocSnap.data() } as orderProps;
}
export function UserProfileFromDoc(doc: DocumentSnapshot): UserProfile {
  const d: UserProfile = { ...(doc.data() as UserProfile), id: doc.id };
  return d;
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
  const profile: Partial<UserProfile> = {
    name: name,
    phoneNumber: phoneNumber,
    email: email,
    photoURL: photoURL,
    role: "user",
    time: serverTimestamp(),
    status: "active",
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
export const reportOrder = async (order: string, why: string) => {
  const uid = getAuth().currentUser?.uid;
  var userReport = mydb.userReports.find((v: any) => {
    return v.byUser === uid;
  });

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
export function deleteOrder(id: string) {
  return deleteDoc(doc(db, "orders/" + id));
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
  var res;
  try {
    res = addDoc(collection(db, "ordersApplications"), newApplication);
  } catch (error) {
    console.log("error on add applictaion to order ${cardUID} : :>> ", error);
  }
  return Promise.all([res]);
}

export const avatarPLaceholder = (name: string) =>
  "https://ui-avatars.com/api/?name=" + name + "&background=0D8ABC&color=fff";
export function getUserInfoPlaceHolder() {
  let info: userInfo = {
    name: "",
    phoneNumber: "",
    photoURL: avatarPLaceholder("s t"),
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
