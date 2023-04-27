import { FCM } from "@capacitor-community/fcm";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  FirebaseMessaging,
} from "@capacitor-firebase/messaging";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import mydb from "../api/firebaseMain";
import { Store } from "pullstate";
import { Capacitor } from "@capacitor/core";

export const TokenStore = new Store({token:''})
class pushFCM {
   token:string=''
   constructor() {
    if(Capacitor.isNativePlatform()){
      this.start()
    }
  }
  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken(): Promise<void> {
    // const options: GetTokenOptions = {
    //   vapidKey: environment.firebase.vapidKey,
    // };
    
    const { token } = await FirebaseMessaging.getToken();
    this.token = token;
  }
  start() {
    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", { event });
    });
    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", { event });
    });
    this.requestPermissions().then(() => {
      console.log("permissions granted");
      this.getToken().then(() => {
        console.log("token: ", this.token);
      });
    });
    
  
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
