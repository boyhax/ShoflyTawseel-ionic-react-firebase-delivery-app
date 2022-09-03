const ttData = require("./transulatedText.json")
// transulated text
export function TT(text:string,language:string="en"){
    var t = ttData[text]
    var l = t?ttData[text][language]:false

    if(t){
        if(l){
            return l
        }else{
            // ttData.writeFile(t,{})
        }
    }else{
        ttData.writeFile(t,{})
    }
    return text
}
// TT("hello")
