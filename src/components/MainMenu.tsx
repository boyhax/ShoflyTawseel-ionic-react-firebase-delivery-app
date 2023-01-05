import { ComponentProps } from "@ionic/core";
import { IonContent, IonTitle, IonHeader, IonToolbar, IonList, IonItem, IonMenu, IonButtons, IonButton, IonIcon, IonRippleEffect, IonLabel, IonAvatar, IonImg } from "@ionic/react";
import { getAuth } from "firebase/auth";
import { closeOutline, } from "ionicons/icons";
import React, { useEffect, } from "react";
import { useHistory } from "react-router";
import { avatarPLaceholder } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";

interface props extends ComponentProps {
    menuRef?: any
}

const MainMenu = (Props: props) => {
    const { user, profile } = useGlobals()
    function close() {
        Props.menuRef.current.close()
    }
    useEffect(() => {
        //  menu.current!.toggle()
    })
    const history = useHistory()
    const SignInButton = <IonButton
        onClick={() => history.push("SignIn")}>Sign In</IonButton>
    const SignOutButton = <IonButton color="danger"
        onClick={() => getAuth().signOut()} >Sign Out</IonButton>

    return <IonMenu  ref={Props.menuRef} contentId="main-content"  >
        {/* <IonHeader >
            <IonToolbar>
                <IonTitle>Menu</IonTitle>
            </IonToolbar>

        </IonHeader> */}
        <IonContent class="ion-padding"  >
            <IonList  >
                
                        <IonButtons slot={'primary'}>
                        <IonButton>
                        
                    {user ?
                     profile ? profile.name! 
                     : profile === undefined ?
                      "signing in.." : "" : ""}
                        </IonButton>
                        <IonAvatar slot={'primary'}>
                        <IonImg src={profile?.photoURL || avatarPLaceholder}>
                        </IonImg>
                    </IonAvatar>
                        </IonButtons>
                       
                    


                {/* </IonToolbar> */}

                <IonItem className="item" onClick={() => history.push("Details")}>Info
                </IonItem>

                {profile?.devloper && <IonItem className="item"

                    onClick={() => history.push("Demo")}>Dev Page
                </IonItem>}

                {user ? SignOutButton : SignInButton}
            </IonList>
        </IonContent>
    </IonMenu>

}
export default MainMenu