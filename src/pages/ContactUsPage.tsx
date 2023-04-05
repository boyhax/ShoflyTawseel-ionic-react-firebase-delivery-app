import { IonContent, useIonAlert, useIonLoading } from "@ionic/react";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { AnyObjectSchema } from "yup";
import mydb from "../api/firebaseMain";
import Page from "../components/Page";
import { TT } from "../components/utlis/tt";

export default function ContactUsPage() {
  const [present,dissmis] = useIonLoading()
  const [alert]=useIonAlert()
  const textInput: any = useRef<HTMLTextAreaElement>();
  const history = useHistory()
  return (
    <Page homeButton>
      <IonContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            present()
            mydb.sendContactUs(textInput.current.value).finally(() => {
              dissmis()
              alert({
                message: TT("Your message has been sent"),
                buttons: [TT("OK")],
              })
              history.push('/')
            })
          }}
          className={"flex flex-col justify-center mt-[50%]"}
        >
          <textarea
            required
            ref={textInput}
            className={"m-5 p-3 text-clip min-h-[200px] border-2 rounded-3xl"}
            wrap="hard"
            placeholder="Write ..."
            
          />
          <button className={"m-5 ring-2 border-2 rounded-xl"} type={"submit"}>
            {TT("Send")}
          </button>
        </form>
        
      </IonContent>
    </Page>
  );
}
