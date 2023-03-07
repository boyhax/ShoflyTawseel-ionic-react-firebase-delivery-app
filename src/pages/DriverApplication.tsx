import React, { FormEvent, useState } from "react";
import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonNote,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { useGlobals } from "../providers/globalsProvider";
import { useHistory } from "react-router";
import { TT } from "../components/utlis/tt";
import { Formik } from "formik";
import * as yup from "yup";
import { mydb } from "../providers/firebaseMain";
import { useDriver } from "../hooks/useDriver";
export default function DriverApplication(props: any) {
  const { profile } = useGlobals();
  const initalData = {
    name: "",
    email: "",
    carNumber: "",
    carType: "",
    carYear: new Date(),
    identity: "",
  };
  const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    carNumber: yup.string().required(),
    carType: yup.string().required(),
    carYear: yup
      .date()
      .max(new Date(), "cant be newer than today")
      .min(new Date("1999-01-01"))
      .required(),
      identity: yup.string().min(8).required(),
  });
  const [data, setData] = useState(initalData);
  const [loading, setloading] = useState(false);

  const history = useHistory();
  const driver = useDriver();
  function hundleSubmit(values: typeof initalData) {
    console.log('values', values);
    setData(values);
    setloading(true)
    mydb.submitDriverApplication(values).then(() => {history.push("/account")});
  }
  return (
    <IonPage>
      <IonLoading isOpen={loading} message={TT('Sending Application')}></IonLoading>
      <div
        className={
          " text-white h-20 bg-[var(--ion-color-primary)] rounded-bl-full drop-shadow-lg flex justify-center flex-col items-center"
        }
      >
        <IonLabel className="text-2xl font-bold ">
          {TT("driver application form")}
        </IonLabel>
        <IonLabel>{TT("please fill  ")}</IonLabel>
      </div>
      <IonContent className={"m-5 border-cyan-400 "}>
        <Formik
          initialValues={initalData}
          onSubmit={hundleSubmit}
          validationSchema={schema}
        >
          {({ values, handleChange, handleSubmit, errors, touched,setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <IonItem>
                <IonLabel position="stacked">{TT("name")}</IonLabel>
                <IonInput
                  name="name"
                  value={values.name}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote color={'danger'}>{errors.name}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("email")}</IonLabel>
                <IonInput
                  name="email"
                  value={values.email}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote color={'danger'}>{errors.email}</IonNote>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">{TT("carNumber")}</IonLabel>
                <IonInput
                  name="carNumber"
                  value={values.carNumber}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote color={'danger'}>{errors.carNumber}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("carType")}</IonLabel>
                <IonInput
                  name="carType"
                  value={values.carType}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote color={'danger'}>{errors.carType}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("carYear")}</IonLabel>
                <IonInput
                  type={"date"}
                  name="carYear"
                  lang={"en"}
                  value={values.carYear.toString()}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote color={'danger'}>{errors.carYear}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("identity number")}</IonLabel>
                <IonInput
                  name="identity"
                  value={values.identity}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote color={'danger'}>{errors.identity}</IonNote>
              </IonItem>
              <IonItem>
                <IonLabel>
                  {TT("i agree to the ")}
                  <IonButton fill={'clear'}>{TT('terms and conditions')}</IonButton>
                </IonLabel>
              </IonItem>
              <IonButton type={"submit"}>{TT("submit")}</IonButton>
            </form>
          )}
        </Formik>
      </IonContent>
    </IonPage>
  );
}
