import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { match } from "assert";
import {
  closeSharp,
  homeSharp,
  menuOutline,
  menuSharp,
  personCircle,
  returnUpBackSharp,
} from "ionicons/icons";
import * as React from "react";
import { useHistory } from "react-router";
import MainMenu from "./MainMenu";
interface Props {
  children: any;
  backbutton?: any;
  closebutton?: any;
  menubutton?: any;
  homeButton?: any;
  onClose?: any;
}
const Page: React.FC<Props> = (props) => {
  const history = useHistory();
  const menu: any = React.useRef();

  function close() {
    history.goBack();
  }
  function togglemenu() {
    menu.current.toggle();
  }

  return (
    <IonPage>
      <IonFab  horizontal={"start"} vertical={"top"}>
        {props.backbutton && (
          <IonFabButton onClick={() => history.goBack()} size={"small"}>
            <IonIcon icon={returnUpBackSharp}></IonIcon>
          </IonFabButton>
        )}
        {props.closebutton && (
          <IonFabButton
            onClick={() => props.onClose && props.onClose()}
            size={"small"}
          >
            <IonIcon icon={closeSharp}></IonIcon>
          </IonFabButton>
        )}
        {props.menubutton && (
          <IonMenuToggle>
            <IonFabButton size={"small"}>
              <IonIcon icon={menuOutline}></IonIcon>
              {/* <IonMenuButton></IonMenuButton>  */}
            </IonFabButton>
          </IonMenuToggle>
        )}
        {props.homeButton && (
          <IonFabButton onClick={() => history.push("/")}>
            <IonIcon icon={homeSharp}></IonIcon>
          </IonFabButton>
        )}
      </IonFab>

      {props.children}
    </IonPage>
  );
};

export default Page;

const beutBackgroundClassName = `flex items-center justify-center min-h-screen
from-red-100 via-red-300 to-blue-500 bg-gradient-to-br`;
