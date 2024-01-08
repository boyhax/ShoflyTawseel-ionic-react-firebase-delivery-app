import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Store } from "pullstate";
import { Capacitor } from "@capacitor/core";

export const TokenStore = new Store({ token: "" });
class pushFCM {
  token: string = "";
  constructor() {
    if (Capacitor.isNativePlatform()) {
      this.start();
    }
  }
  async start() {
    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", JSON.stringify(event));
    });
    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", JSON.stringify(event));
    });
    
    this.requestPermissions().then(() => {
      console.log("permissions granted");
    });
  }
  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }

  public async getToken() {
    const { token } = await FirebaseMessaging.getToken();
    console.log("token from FirebaseMessaging.getToken(): ", this.token);

    return token;
  }

  addListeners = async () => {};

  getPrimissions = async () => {};

  // move to fcm demo
  async subscribeTo(topic: string) {
    if(!Capacitor.isNativePlatform()) return

    FirebaseMessaging.subscribeToTopic({ topic });
  }

  unsubscribeFrom(topic: string) {
    if(!Capacitor.isNativePlatform()) return
    FirebaseMessaging.unsubscribeFromTopic({ topic });
  }

  getDeliveredNotifications = async () => {
    if(!Capacitor.isNativePlatform()) return

    return FirebaseMessaging.getDeliveredNotifications().then((res) =>res.notifications);
  };
}

export default new pushFCM();
