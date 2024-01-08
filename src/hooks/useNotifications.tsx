import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from "@capacitor/push-notifications";
import * as React from "react";
import { Toast } from "@capacitor/toast";
import { userStore } from "../Stores/userStore";
import { TokenStore } from "../services/pushFCM";
import { useEffect } from "react";
import { Store } from "pullstate";

export const notificationsStore = new Store<{ Notifications: any[] }>({
  Notifications: [],
});

export default function useNotifications() {
  const nullEntry: any[] = [];
  const [notifications, setnotifications] = React.useState(nullEntry);
  const [token, setToken] = React.useState("");
  useEffect(() => {
    checkPermission().then((res) => {
      if (res === "granted") {
        register();
      }
    });
  }, []);

  async function checkPermission() {
    const permission = await PushNotifications.checkPermissions();
    if (permission.receive !== "granted") {
      const request = await PushNotifications.requestPermissions();
      if (request.receive === "denied") {
        showToast("Push Notification permission denied");
        return "denied";
      } else {
        showToast("Push Notification permission granted");
        return "granted";
      }
    } else {
      return "granted";
    }
  }
  const register = () => {
    console.log("Initializing HomePage");

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      TokenStore.update((s) => {
        s.token = token.value;
      });

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
        notificationsStore.update((s) => {
          s.Notifications = notifications;
        });
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
        notificationsStore.update((s) => {
          s.Notifications = notifications;
        });
      }
    );
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();
  };

  const showToast = async (msg: string) => {
    await Toast.show({
      text: msg,
    });
  };

  return { token, notifications, register };
}
