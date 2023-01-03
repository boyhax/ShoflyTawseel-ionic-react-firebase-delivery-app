import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonImg, IonLabel, IonMenuButton, IonMenuToggle, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { match } from 'assert';
import { closeSharp, menuSharp, personCircle, returnUpBackSharp } from 'ionicons/icons';
import * as React from 'react';
import { useHistory } from 'react-router';
import MainMenu from './MainMenu';
interface Props {
    children: any,
    backbutton?: any,
    closebutton?: any
    menubutton?: any


}
const Page: React.FC<Props> = (props) => {
    const history = useHistory()
    const menu: any = React.useRef()

    function close() {
        history.goBack()
    }
    function togglemenu() {
        menu.current.toggle()
    }
    function button(v: string) {
        switch (v) {
            case 'close':
                close()
                break;
            case "goback":
                history.goBack();
                break;
            case 'menu':
                togglemenu();
                break;
            default:
                break;
        }
    }
    return <IonPage >
        <MainMenu menuRef={menu} ></MainMenu>
        <IonFab slot={'fixed'} horizontal={'start'} vertical={'top'} >

        {props.backbutton && 
            <IonFabButton size={'small'}>
                <IonIcon icon={returnUpBackSharp}></IonIcon>
            </IonFabButton>
        }
        {props.closebutton && 
            <IonFabButton size={'small'}>
                <IonIcon icon={closeSharp}></IonIcon>
            </IonFabButton>
        }
        {props.menubutton && 
            <IonFabButton >
                <IonMenuButton></IonMenuButton>
                {/* <IonIcon icon={menuSharp}></IonIcon> */}
            </IonFabButton>
        }
                </IonFab>


        <IonContent fullscreen>

            {props.children}
        </IonContent>



    </IonPage>
}


export default Page;
