import { IonAvatar, IonBackButton, IonButton, IonButtons, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonImg, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import * as React from 'react';
import { useHistory   } from 'react-router';

const Page: React.FC = (props) => {
    const history = useHistory()
    return <IonPage >
        {/* <IonFab>
            <IonFabButton>
                <IonMenuButton></IonMenuButton>
            </IonFabButton>
        </IonFab> */}
        <IonHeader>
            <IonToolbar title={"ddd"}>
                <IonButtons>
                    <IonMenuButton slot={'start'}></IonMenuButton>

                </IonButtons>

            </IonToolbar>
        </IonHeader>

        {props.children}
        {/* <IonButtons slot="start">
        <IonBackButton defaultHref='/'></IonBackButton>
      </IonButtons> */}
        {/* <IonTitle slot='primary' onClick={() => history.push("/home")}
      >ShoflyTawseel
      </IonTitle> */}
        <IonFooter >
            <IonToolbar>
                <IonButtons>
                    <IonButton>
                        <IonIcon icon={personCircle} />
                        <IonLabel>Profile</IonLabel>
                    </IonButton>
                    <IonButton>
                        <IonIcon icon={personCircle} />
                        <IonLabel>Profile</IonLabel>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonFooter>
    </IonPage>
}


export default Page;
