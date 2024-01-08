import { IonPage, IonTitle } from "@ionic/react";
import * as React from "react";
import SignIn from "../pages/authPages";
import { userStore } from "../Stores/userStore";

const AdminRoute: React.FC = (props) => {
  const { user, profile } = userStore.useState();

  return (
    <div style={{ background: "red" }}>
      {user && profile?.role === "admin" && props.children}
      {!user && <SignIn />}
      {user && profile?.role !== "admin" && (
        <IonPage>
          <IonTitle>Admin Only Page</IonTitle>
        </IonPage>
      )}
    </div>
  );
};
export default AdminRoute;
