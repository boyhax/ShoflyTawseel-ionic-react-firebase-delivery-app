import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonInput,
  IonItem,
  IonToolbar,
  IonLabel,
  IonNote,
  IonAccordionGroup,
  IonAccordion,
  IonButtons,
  useIonAlert,
  useIonToast,
  IonChip,
} from "@ionic/react";
import {
  checkmarkDoneCircleOutline,
  createOutline,
  logOutOutline,
  mailOutline,
  personCircleOutline,
  phonePortraitOutline,
  saveOutline,
  ticketOutline,
} from "ionicons/icons";
import { getAuth } from "firebase/auth";
import mydb, { avatarPLaceholder } from "../api/firebaseMain";
import { TT } from "../components/utlis/tt";
import CreatProfile from "./CreatProfile";
import { useHistory } from "react-router";
import Page from "../components/Page";
import ProfileAvatar from "../components/ProfileAvatar";
import { userStore } from "../Stores/userStore";

const Account: React.FC = () => {
  const { user, profile, driver } = userStore.useState((s) => s);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState(false);
  const [content, setContent] = useState<"orders" | "deliver" | "editProfile">(
    "orders"
  );
  const [alert] = useIonToast();
  const history = useHistory();

  return (
    <Page homeButton>
      <IonContent fullscreen className={""}>
        <IonToolbar className={"flex  h-28 items-center ion-padding"}>
          <ProfileAvatar
            url={profile?.photoURL ?? avatarPLaceholder(profile?.name ?? "s t")}
            onClick={() => {}}
          />
          <div className={"flex flex-row  justify-around"}>
              {/* <IonIcon className={'m-auto  h-10 w-10'} icon={personCircleOutline} /> */}
              <IonButton
              disabled={false}
              slot={"end"}
              fill={"clear"}
              onClick={() => {
                if (editName) {
                  if (newName.length < 5) {
                    alert("name must be at least 5 characters", 2000);
                  } else {
                    setEditName(false);
                    mydb.updateProfile({ name: newName });
                    alert("name updated", 2000);
                  }
                } else {
                  setEditName(true);
                }
              }}
            >
              {editName ? (
                <IonIcon icon={saveOutline} />
              ) : (
                <IonIcon icon={createOutline} />
              )}
            </IonButton>
              <IonInput
                style={{ direction: "" }}
                slot={"end"}
                value={newName || profile?.name || "Name"}
                disabled={!editName}
                onIonChange={(e) => {
                  setNewName(e.detail.value!);
                }}
              ></IonInput>
            
          </div>
        </IonToolbar>

        <IonList>
          <IonAccordionGroup mode={"ios"} multiple={true} value={["first"]}>
            <IonAccordion value={"first"}>
              <IonItem slot="header" color="light">
                <IonLabel>{TT("Account information")}</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
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
                  <div>
                    {/* <IonChip>carNumber {driver.carNumber}</IonChip>
                    <IonChip>carType {driver.carType}</IonChip>
                    <IonChip> carYear{driver.carYear}</IonChip>
                    <IonChip>identity {driver.identity}</IonChip> */}
                    <IonItem>
                      <IonLabel>{TT("Status")}</IonLabel>
                      <IonLabel>{TT(driver.status)}</IonLabel>
                    </IonItem>
                  </div>
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
