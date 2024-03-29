import React, { useMemo, useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonNote,
  IonThumbnail,
  useIonToast,
} from "@ionic/react";
import { TT } from "../components/utlis/tt";
import { Formik } from "formik";
import * as yup from "yup";
import { mydb } from "../api/firebaseMain";
import { useDriver } from "../hooks/useDriver";
import Page from "../components/Page";
import ImagePicker from "../components/ImagePicker";
import { useHistory } from "react-router";

export default function DriverApplicationPage(props: any) {
  const { driver } = useDriver();
  const history = useHistory()
  const [toast] = useIonToast()
  const initalData = useMemo(() => {
    return driver
      ? {
          car_image: driver.car_image,
          car_number: driver.car_number,
          car_card_image: driver.car_card_image,
          driving_license_image: driver.driving_license_image,
          driver_id_image: driver.driver_id_image,
          driver_id: driver.driver_id,
        }
      : {
          car_image: "",
          car_number: "",
          car_card_image: "",
          driving_license_image: "",
          driver_id_image: "",
          driver_id: "",
        };
  }, [driver]);

  const schema = yup.object({
    car_image: yup.string().required(),
    car_number: yup.string().required(),
    car_card_image: yup.string().required(),
    driving_license_image: yup.string().required(),
    driver_id_image: yup.string().required(),
    driver_id: yup.string().required(),
  });
  const [loading, setloading] = useState(false);

  async function hundleSubmit(values: any) {
    setloading(true);
    try {
      await mydb.addNewDriver(values);
        setloading(false);
        history.push('/account');
        toast(TT('Your Application Sent Successfully'), 2000, );
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    <Page backbutton>
      <IonLoading
        isOpen={loading}
        message={driver ? TT("updating") : TT("Sending Application")}
      ></IonLoading>
      <div
        className={
          " text-white h-20 bg-[var(--ion-color-primary)] rounded-bl-full drop-shadow-lg flex justify-center flex-col items-center"
        }
      >
        <IonLabel className="text-2xl font-bold ">
          {TT(" Enter Car Info")}
        </IonLabel>
        {/* <IonLabel>{TT("please fill  ")}</IonLabel> */}
      </div>
      <IonContent className={"ion-padding  border-cyan-400 "}>
        <Formik
          initialValues={initalData}
          onSubmit={hundleSubmit}
          validationSchema={schema}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <IonItem>
                <IonLabel position="stacked">{TT("driver_id")}</IonLabel>
                <IonInput
                className={'border-b-2 rounded-xl px-5'}
                  name="driver_id"
                  lang={"en"}
                  value={values.driver_id}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote className={"text-sm"} color={"danger"}>
                  {errors.driver_id}
                </IonNote>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("car number")}</IonLabel>
                <IonInput
                className={'border-b-2 rounded-xl px-5'}
                  name="car_number"
                  lang={"en"}
                  value={values.car_number}
                  onIonChange={handleChange}
                ></IonInput>
                <IonNote className={"text-sm"} color={"danger"}>
                  {errors.car_number}
                </IonNote>
              </IonItem>
              <IonItem></IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("car_image")}</IonLabel>
                <IonThumbnail
                  className={" w-full h-[150px] rounded-xl overflow-hidden "}
                >
                  <ImagePicker
                    onChange={(value) => {
                      setFieldValue("car_image", value);
                      console.log(value);
                    }}
                  />
                </IonThumbnail>

                <IonNote className={"text-sm"} color={"danger"}>
                  {errors.car_image}
                </IonNote>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{TT("car_card_image")}</IonLabel>
                <IonThumbnail
                  className={" w-full h-[150px] rounded-xl overflow-hidden "}
                >
                  <ImagePicker
                    onChange={(value) => {
                      setFieldValue("car_card_image", value);
                      console.log(value);
                    }}
                  />
                </IonThumbnail>
                <IonNote className={"text-sm"} color={"danger"}>
                  {errors.car_card_image}
                </IonNote>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">{TT("driver_id_image")}</IonLabel>
                <IonThumbnail
                  className={" w-full h-[150px] rounded-xl overflow-hidden "}
                >
                  <ImagePicker
                    onChange={(value) => {
                      setFieldValue("driver_id_image", value);
                      console.log(value);
                    }}
                  />
                </IonThumbnail>
                <IonNote className={"text-sm"} color={"danger"}>
                  {errors.driver_id_image}
                </IonNote>
              </IonItem>

             
              <IonItem>
                <IonLabel position="stacked">
                  {TT("driving_license_image")}
                </IonLabel>
                <IonThumbnail
                  className={" w-full h-[150px] rounded-xl overflow-hidden "}
                >
                  <ImagePicker
                    onChange={(value) => {
                      setFieldValue("driving_license_image", value);
                      console.log(value);
                    }}
                  />
                </IonThumbnail>
                <IonNote className={"text-sm"} color={"danger"}>
                  {errors.driving_license_image}
                </IonNote>
              </IonItem>

              <IonButton color={"primary"} className={"w-full"} type={"submit"}>
                {TT("submit")}
              </IonButton>
            </form>
          )}
        </Formik>
      </IonContent>
    </Page>
  );
}
