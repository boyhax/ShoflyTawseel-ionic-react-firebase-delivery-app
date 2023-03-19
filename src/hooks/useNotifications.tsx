import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from "@capacitor/push-notifications";
import * as React from "react";
import { Toast } from "@capacitor/toast";
import { useGlobals } from "../providers/globalsProvider";
import mydb, { db } from "../providers/firebaseMain";
import { doc, setDoc } from "firebase/firestore";
import { userStore } from "../Stores/userStore";

export default function useNotifications() {
  const nullEntry: any[] = [];
  const [notifications, setnotifications] = React.useState(nullEntry);
  const [token, setToken] = React.useState("");
  const {user,profile} = userStore.useState()
  React.useEffect(() => {
    if (user) {
      setDoc(doc(db, "fcmTokens/", user.uid), { token })
        .then(() => console.log("token saved"))
        .catch((e) => console.log("error saving token", e));
    }
  }, [user]);

  React.useEffect(() => {
    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== "granted") {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive === "denied") {
            showToast("Push Notification permission denied");
          } else {
            showToast("Push Notification permission granted");
            register();
          }
        });
      } else {
        register();
      }
    });
  }, []);

  const register = () => {
    console.log("Initializing HomePage");

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      setToken(token.value);

      showToast("Push registration success");
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        setnotifications((notifications) => [
          ...notifications,
          {
            id: notification.id,
            title: notification.title,
            body: notification.body,
            type: "foreground",
          },
        ]);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        setnotifications((notifications) => [
          ...notifications,
          {
            id: notification.notification.data.id,
            title: notification.notification.data.title,
            body: notification.notification.data.body,
            type: "action",
          },
        ]);
      }
    );
  };

  const showToast = async (msg: string) => {
    await Toast.show({
      text: msg,
    });
  };
  
  return {  token, notifications, register };
}
