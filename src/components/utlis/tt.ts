import { getLang } from "../../App";
// import fs from "fs";

const ttData = require("../../assets/transulatedText.json");

// transulated text
export function TT(text: string, language?: string) {
  language || (language = getLang());
  var key = ttData[text];
  var langKey = key ? ttData[text][language]?ttData[text][language]:false : false;

  if (key) {
    if (langKey) {
      return langKey;
    } else {
      let newdata = ttData;
      newdata[text][language] = text;
      newdata = JSON.stringify(newdata);
      update(newdata);
    }
  } else {
    let newdata = ttData;
    newdata[text] =  {en:text,ar:text} ;
    newdata = JSON.stringify(newdata);
    update(newdata);
  }
  return text;
}
// TT("hello")
function update(newData: any) {
    console.log('new translation file :>> ', newData);
// newData
//     "../../assets/transulatedText.json",
//     newData,
//     "utf8",
//     function (err: any) {
//       if (err) {
//         console.log("An error occured while writing JSON Object to File.");
//         return console.log(err);
//       }

//       console.log("translation JSON file has been saved.");
//     }
//   );
}
