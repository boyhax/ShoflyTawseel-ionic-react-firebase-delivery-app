const { onRequest, onCall } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const { getFirestore } = require("firebase-admin/firestore");
initializeApp();

const cors = require("cors")({
  origin: true,
});

exports.onorder = onDocumentCreated("orders/{docId}", ({ snap }, context) => {
  const order = snap.data();
  const { uid } = order;
  return getFirestore()
    .collection("fcmTokens")
    .doc(uid)
    .get()
    .then((doc) => {
      const token = doc.data().token;
      if (!token) return "no token found for user:=>" + uid;
      try {
        getMessaging().send({
          notification: {
            title: "new order",
            body: "you made a new order",
          },
          token,
        });
        return "Successfully sent message:=>";
      } catch (error) {
        return error;
      }
    })
    .catch((error) => {
      console.log("error sending message: =>", error);
      reject(error);
    });
});

exports.sendmessage = onCall((data, context) => {
  getMessaging()
    .send(data)
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
