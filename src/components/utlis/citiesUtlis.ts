import React from "react";
type dataProps={
    value:string,
    key:string
}
export const citiesList:string[] = require("../../assets/cities.json")[0]["oman"]["ar"]

export var Cities :dataProps[]=[]
citiesList.map((value:string,i:number) => {
    Cities.push({value:value,key:String(i)})
    
})
// [{"value":"آدم","key":"0"},{"value":"السيب","key":"1"},{"value":"الأشخرة","key":"2"},{"value":"البريمي","key":"3"},{"value":"الحمرا","key":"4"},{"value":"الجازر","key":"5"},{"value":"المدينة الزرقاء ","key":"6"},{"value":"السويق","key":"7"},{"value":"بهلاء","key":"8"},{"value":"بركاء","key":"9"},{"value":"بدبد","key":"10"},{"value":"بدية","key":"11"},{"value":"الدقم","key":"12"},{"value":"هيما","key":"13"},{"value":"إبرا","key":"14"},{"value":"عبري","key":"15"},{"value":"إزكي","key":"16"},{"value":"جبرين","key":"17"},{"value":"جعلان بني بو علي","key":"18"},{"value":"جعلان بني بو حسن","key":"19"},{"value":"خصب","key":"20"},{"value":"محوت","key":"21"},{"value":"منح","key":"22"},{"value":"مصيرة","key":"23"},{"value":"مطرح","key":"24"},{"value":"مضيبي","key":"25"},{"value":"مضيرب","key":"26"},{"value":"مسقط","key":"27"},{"value":"نزوى","key":"28"},{"value":"قريات","key":"29"},{"value":"ريسوت","key":"30"},{"value":"الرستاق","key":"31"},{"value":"روي","key":"32"},{"value":"صحم","key":"33"},{"value":"شناص","key":"34"},{"value":"سيق","key":"35"},{"value":"صلالة","key":"36"},{"value":"سمائل","key":"37"},{"value":"صحار","key":"38"},{"value":"صور","key":"39"},{"value":"تنعم","key":"40"},{"value":"ثمريت","key":"41"}]