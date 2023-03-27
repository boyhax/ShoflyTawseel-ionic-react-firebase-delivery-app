const functions = require("firebase-functions");
const admin = require("firebase-admin");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
const cors = require("cors")({
  origin: true,
});
module.exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
module.exports.newOrder = functions.firestore
  .document("orders/{docId}")
  .onCreate(async (snap, context) => {
    var driverFound = false;
    var triesLeft = 5;
    const possibleDrivers = await admin
      .firestore()
      .collection("drivers")
      .limitToLast(5)
      .get()
      .catch((err) => console.log("error of getting drivers=>", err));
    possibleDrivers.forEach(async (doc) => {
      const token = await admin
        .firestore()
        .doc("fcmTokens/" + doc.id)
        .get()
        .then((d) => d.data().token || null)
        .catch((err) => console.log(err));

      if (token) {
        functions.messaging().send({
          body: {
            title: "hello you have job",
            id: doc.id,
          },
          notification: {
            title: "hello you have job",
            body: "do you agree",
          },
          topic: "all",
          token,
        });
      }
    });
  });

module.exports.onPushCreated = functions.firestore
  .document("push/{docId}")
  .onCreate((snap, context) => {
    admin.messaging().sendToDevice(snap.data().token,snap.data()).then(res=>console.log(" Successfully sent push:=>",res)).catch(err=>console.log("error sending push: =>", err));
  });
module.exports.sendMessage = functions.https.onCall((data, context) => {
  cors(data, res, () => {
    const payload = {
      ...data
    };
    admin
      .messaging()
      .send(payload)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:");
        return "Successfully sent message:=>", response;
      })
      .catch((error) => {
        console.log("error sending message: =>", error);

        return { error: error.code };
      });
  });
});
