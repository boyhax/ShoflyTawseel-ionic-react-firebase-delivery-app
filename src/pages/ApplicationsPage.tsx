import React, { FC, useEffect, useReducer, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar, IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonSlides, IonSlide, IonCard, IonCardTitle, IonSegment, IonSegmentButton, IonChip, IonIcon } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, DocumentData, DocumentSnapshot, FieldValue, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import { useHistory, useParams } from 'react-router';
import { TT } from '../components/utlis/tt';
import { db } from '../App';
import { ApplicationProps, getUserInfoPlaceHolder, makeApplicationPropsFromDoc, makeUSerInfoFromDoc, userInfo } from '../providers/firebaseMain';
import { thumbsDown, thumbsUp } from 'ionicons/icons';

const ApplicationsPage: React.FC = () => {
  const { user, profile } = useGlobals()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DocumentSnapshot<DocumentData>[]>([])
  const [segment, setsegment] = useState<"byUser" | "forUser">("byUser")

  const auth = getAuth()
  const id: any = useParams()
  const history = useHistory()

  useEffect(() => {
    if (!id.id) {
      alert("uncorrect ref")
      return
    }
    var d: any = []
    const v = onSnapshot(query(collection(getFirestore(), "ordersApplications/" + id.id + "/col")), (docs) => {
      docs.docs.forEach((value) => {
        d.push(value.data())
      })
      setData(d)

    })
    return () => v()
  }, []);


  return (
    <IonPage >

      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle slot='primary' >
          {TT("application to order")}
        </IonTitle>
      </IonToolbar>
      <IonSegment>
        <IonSegmentButton></IonSegmentButton>
      </IonSegment>
      <IonContent>
        {data && data.map((value) => {
          return <ApplicationCard docsnap={value}>

          </ApplicationCard>
        })}

      </IonContent>
    </IonPage>
  );
};

export default ApplicationsPage;


export const ApplicationCard: React.FC<{ docsnap: DocumentSnapshot<DocumentData> }> = ({ docsnap }) => {
  const [user, setUser] = useState<userInfo>(getUserInfoPlaceHolder())
  const [data, setData] = useState<ApplicationProps>(makeApplicationPropsFromDoc(docsnap))

  useEffect(() => {

    const unsub = onSnapshot(doc(db, "users", data.byUser), (snap) => {
      setUser(makeUSerInfoFromDoc(snap))
    })
    return () => { unsub() }
  }, [])

  return <IonCard>
    <IonItem>
      <IonLabel>Name :</IonLabel>
      <IonLabel>{user.name}</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel>time :</IonLabel>
      {new Date(data.timeSend.seconds * 1000).toLocaleString()}
    </IonItem>
    <IonItem>
      <IonLabel>isAccepted :</IonLabel>
      <IonLabel>{data.isAccepted ? "Yes" : "No"}</IonLabel>
    </IonItem>
    <IonItem dir='ltr'>
      Done: {data.isDone ? "YES " : "NO "}
      <IonIcon icon={data.isDone ? thumbsUp : thumbsDown}></IonIcon>
      On Date {new Date(data.timeDone.seconds * 1000).toLocaleString()}

    </IonItem>
    <IonItem>
      <IonLabel>for user :</IonLabel>
      <IonLabel>{"for user"}</IonLabel>
    </IonItem>
  </IonCard>
}