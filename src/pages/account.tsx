import React, { useState } from "react";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonList,
  IonInput,
  IonItem,
  IonToolbar,
  IonLabel,
  IonNote,
  IonAccordionGroup,
  IonAccordion,
  IonChip,
  IonCard,
} from "@ionic/react";
import {
  logOutOutline,
  mailOutline,
  personCircleOutline,
  phonePortraitOutline,
} from "ionicons/icons";
import { getAuth } from "firebase/auth";
import { avatarPLaceholder, mydb } from "../api/firebaseMain";
import { TT } from "../components/utlis/tt";
import CreatProfile from "./CreatProfile";
import { useHistory } from "react-router";
import { usePhoto } from "../hooks/usePhoto";
import Page from "../components/Page";
import ProfileAvatar from "../components/ProfileAvatar";
import { userStore } from "../Stores/userStore";
import { DriverStatus } from "../types";
import useDriverUserMode from "../hooks/useDriverUserMode";
import { useDriver } from "../hooks/useDriver";

const Account: React.FC = () => {
  const { user, profile, driver } = userStore.useState((s) => s);
  const [content, setContent] = useState<"orders" | "deliver" | "editProfile">(
    "orders"
  );
  const history = useHistory();

  const hundleActiveState = () => {
    driver &&
      mydb.updateDriver({
        status:
          driver.status === "active"
            ? DriverStatus.inactive
            : DriverStatus.active,
      });
  };
  return (
    <Page homeButton>
      <IonContent fullscreen className={''}>
        <IonToolbar className={"flex h-28 items-center ion-padding"}>
          <ProfileAvatar
            url={profile?.photoURL ?? avatarPLaceholder(profile?.name ?? "s t")}
            onClick={() => {}}
          />
          
        </IonToolbar>

        <IonList>
          <IonAccordionGroup mode={"ios"} multiple={true} value={["first"]}>
            <IonAccordion value={"first"}>
              <IonItem slot="header" color="light">
                <IonLabel>Account information</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                <IonItem>
                  <IonIcon icon={personCircleOutline} />
                  <IonInput
                    style={{ direction: "ltr" }}
                    slot={"end"}
                    value={profile?.name || "Name"}
                    disabled={true}
                    onIonChange={(e) => {
                      // mydb.updateProfile({ name: e.detail.value! });
                    }}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonIcon icon={mailOutline} />
                  <IonInput
                    style={{ direction: "ltr" }}
                    slot={"end"}
                    value={profile?.email}
                    disabled={true}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonIcon icon={phonePortraitOutline} />
                  <IonInput
                    style={{ direction: "ltr" }}
                    slot={"end"}
                    value={profile?.phoneNumber}
                    disabled={true}
                  ></IonInput>
                </IonItem>
              </div>
            </IonAccordion>
            <IonAccordion value={"secound"}>
              <IonItem slot="header" color="light">
                <IonLabel>driver information</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                {driver && driver.status === "pending" && (
                  <IonNote color={"success"}>
                    {TT(
                      "Your Application under review thank you for your patiency.🎕"
                    )}
                  </IonNote>
                )}
                {driver && driver.status === "banned" && (
                  <IonLabel color={"danger"}>
                    {TT(
                      "OOBS you are banned sorry.contact us if you want to know more.🙁"
                    )}
                  </IonLabel>
                )}
                {driver && (
                  <IonItem>
                    <IonButton
                      fill={"clear"}
                      onClick={() => history.push("/driverupdate")}
                    >
                      {TT("edit driver information")}
                    </IonButton>
                  </IonItem>
                )}
                {!driver && (
                  <IonItem>
                    <IonButton
                      fill={"clear"}
                      onClick={() => history.push("/driverapplication")}
                    >
                      {TT("Register As Driver")}
                    </IonButton>
                  </IonItem>
                )}
                {driver && (
                  <IonCard>
                    {/* <IonChip>carNumber {driver.carNumber}</IonChip>
                    <IonChip>carType {driver.carType}</IonChip>
                    <IonChip> carYear{driver.carYear}</IonChip>
                    <IonChip>identity {driver.identity}</IonChip> */}
                    <IonNote>status {driver.status}</IonNote>
                  </IonCard>
                )}
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </IonList>

        {content === "editProfile" && (
          <IonContent>
            <CreatProfile
              onSave={() => {
                setContent("deliver");
              }}
            />
          </IonContent>
        )}
      </IonContent>
      <IonButton
        className={"self-center fixed bottom-0 w-11/12"}
        fill={"clear"}
        color={"danger"}
        onClick={() => {
          getAuth().signOut();
        }}
      >
        {TT("logOut")}
        <IonIcon icon={logOutOutline}></IonIcon>
      </IonButton>
    </Page>
  );
};

export default Account;
