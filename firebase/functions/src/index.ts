import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {generateName} from "./generateName";

admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.onOrderRequestAccepted = functions.firestore
    .document("orders/{docId}")
    .onCreate((snap, context) => {
      functions.logger.log("new order added: ", context.params.docId);
    });
exports.onOrderReported = functions.firestore
    .document("ordersReports/{docId}")
    .onCreate((snap, context) => {
      functions.logger.log("new report added: ", context.params.docId);
      const orderOwner = snap.data().orderOwner;
      const from = snap.data().from;
      const orderId = snap.data().orderId;
      const reportId = context.params.docId;
      admin.firestore().doc("users/"+orderOwner).update({
        ordersReportsGot: admin.firestore.FieldValue.arrayUnion(reportId),
      });
      admin.firestore().doc("users/"+from).update({
        reportsDone: admin.firestore.FieldValue.arrayUnion(reportId),
      });
      admin.firestore().doc("orders/"+orderId).update({
        reportsGot: admin.firestore.FieldValue.arrayUnion(reportId),

      });
    });
exports.onOrderCreated = functions.firestore
    .document("orders/{docId}")
    .onCreate((snap, context) => {
      // functions.logger.log("new order added: ", context.params.docId);
      // const orderOwner = snap.data().uid;
      // const orderId = snap.id;
      // admin.firestore().doc("users/"+orderOwner).update({
      //   ordersDone: admin.firestore.FieldValue.arrayUnion(orderId),
      // });
      const newFrom = getCity(snap.data().geo.from);
      const newTo=getCity(snap.data().geo.from);
      Promise.all([newFrom, newTo]).then(([from, to])=>{
        snap.ref.update({
          from: from.city||"",
          to: to.city ||""});
      });
    });
exports.onNewUser = functions.auth.user().onCreate((user) => {
  // ...
  const name = user.displayName?"USER"+user.displayName:generateName();
  const photo = user.photoURL?user.photoURL:"https://avatars.dicebear.com/api/croodles-neutral/{}.svg?size=127".replace("{}", name);

  admin.firestore().doc("users/"+user.uid).set({
    name: name,
    photoURL: photo,
    email: user.email,
    phone: user.phoneNumber,
  });
});
exports.onUserLoggedIn = functions.auth.user().beforeSignIn(async (user) => {
  // ...
  // const name = user.displayName?user.displayName:generateName();
  // const photo = user.photoURL?user.photoURL:"https://avatars.dicebear.com/api/croodles-neutral/your-custgggggggggom-sggggggggggggggeed.svg?size=127";
  let res;
  await admin.firestore().doc("users/"+user.uid).get().then((snap)=>{
    res = snap.data();
    if (res ) {
      if (res["name"] == undefined) {
        console.log("no name :>> ", user.uid);
      }
    }
  });
  // admin.firestore().doc("user/"+user.uid).update({
  //   name: name,
  //   photoURL: photo,
  //   email: user.email,
  // });
});

exports.onDeleteUser = functions.auth.user().onDelete((user) => {
  admin.firestore().collection("users").doc(user.uid).get().then((snap)=>{
    snap.data()!.ordersDone.forEach((value:string) => {
      admin.firestore().collection("orders").doc(value).delete;
    });
  });

  admin.firestore().collection("users").doc(user.uid).delete;
});

async function getCity(point:any, onResult:(coty:string)=>void=(d:string)=>"") {
  const url =`https://api.bigdatacloud.net/data/
  reverse-geocode-client?latitude=${point.latitude}
  &longitude=${point.longitude}&localityLanguage=${"en"}`;

  const t = await (await fetch(url, {
    method: "GET",
    headers: {},
  })).json();
  onResult(t?t.city:"");
  return t?t.city:"";
}
