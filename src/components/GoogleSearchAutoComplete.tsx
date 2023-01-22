import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Config } from "../config";

interface Props {
  onValue: (v: any) => void;
}

export default function GoogleSearchAutoComplete(props: Props) {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    props.onValue(value);
  }, [value]);

  return (
    <GooglePlacesAutocomplete
    apiOptions={{
      region:'OM',
      language:'ar'
    }}
      selectProps={{
        onChange: setValue,
      }}
      apiKey={Config().mapApiKey}
    />
  );
}
