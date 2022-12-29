import { ComponentProps } from "@ionic/core";
import { IonContent, IonTitle, IonHeader, IonToolbar, IonList, IonItem, IonMenu, IonButtons, IonButton, IonIcon, IonRippleEffect, IonLabel, IonAvatar, IonImg } from "@ionic/react";
import { getAuth } from "firebase/auth";
import { closeOutline, } from "ionicons/icons";
import React, { useEffect, } from "react";
import { useHistory } from "react-router";
import { avatarPLaceholder } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import "./MainMenu.css"

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
    const SignInButton = <IonButton onClick={() => history.push("SignIn")}>Sign In</IonButton>
    const SignOutButton = <IonButton color="danger" onClick={() => getAuth().signOut()} >Sign Out</IonButton>

    return <IonMenu side="start" ref={Props.menuRef} contentId='mainContent' >
        <IonHeader >
            {/* <IonToolbar color="primary" > */}

            <IonItem color={'secondary'} className="item" onClick={() => history.push("Profile")}>
                <IonLabel>{user ? profile ? profile.name! : profile === undefined ? "signing in.." : "" : ""}</IonLabel>
                <IonAvatar><IonImg src={profile?.photoURL || avatarPLaceholder}></IonImg></IonAvatar>
            </IonItem>
            {/* </IonToolbar> */}

        </IonHeader>
        <IonContent  >
            <IonList >


               <IonItem className="item" onClick={() => history.push("Details")}>Info
                </IonItem>
               
                {profile?.devloper && <IonItem className="item" 

                onClick={() => history.push("Demo")}>Info
                </IonItem>}
                {user ? SignOutButton : SignInButton}
            </IonList>
        </IonContent>
    </IonMenu>

}
export default MainMenu