import { FCM } from "@capacitor-community/fcm";
import { getFunctions, httpsCallable } from "firebase/functions";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import mydb from "../api/firebaseMain";
import { Store } from "pullstate";

export const TokenStore = new Store({token:''})
class pushFCM {
   token:string=''
  constructor() {
    this.addListeners();
    this.subscribeTo("all");
  
  }

  addListeners = async () => {
    await PushNotifications.addListener("registration", (token) => {
      console.info("##########Registration token: ", token.value);
      this.token = token.value
      mydb.updateToken(token.value);
    });
    await PushNotifications.addListener("registrationError", (err) => {
      console.error("##########Registration error: ", err.error);
    });
    await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("##########Push notification received: ", notification);
      }
    );
    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log(
          "##########Push notification action performed",
          notification.actionId,
          notification.inputValue
        );
      }
    );
  };

  getPrimissions = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.log("##########User denied permissions!");
      return false;
    }

    await PushNotifications.register();
    return true;
  };

  // move to fcm demo
  async subscribeTo(topic: string) {
    var granted = await this.getPrimissions();
    if (granted) {
      PushNotifications.register()
        .then((_) => {
          FCM.subscribeTo({ topic: topic })
            .then((r) => {
              console.log(`##########subscribed to topic ${topic}`);
              return true;
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(JSON.stringify(err)));
    } else {
      alert("##########Please allow notifications");
      return false;
    }
    return true;
  }

  unsubscribeFrom(topic: string) {
    FCM.unsubscribeFrom({ topic: topic })
      .then((r) => console.log(`unsubscribed from topic ${topic}`))
      .catch((err) => console.log(err));
  }

  getDeliveredNotifications = async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log("delivered notifications", notificationList);
  };
  sendPush(message: any) {
    mydb.sendPush(message);
  }
}

const pushinstance = new pushFCM();
export default pushinstance;
