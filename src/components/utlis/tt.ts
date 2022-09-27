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
        var d = ttData
        d[text]={en:text}
        d= JSON.stringify(d)
        // ttData.writeFile("transulatedText.json",d,()=>{
        //     console.log("done")
        // })
    }
    return text
}
// TT("hello")
