import moment from 'moment';
export function prettyDate(date:Date){
  var d 
  d= moment(date).fromNow(true)+" ago";
  var dd = moment(new Date()).diff(moment(date),'days') 
  var yy = moment(new Date()).diff(moment(date),'years') 
  if (yy>=1){
    return "on "+ date.getDate() + "/"+date.getMonth()+"/"+date.getFullYear()
  }
  if (dd >=30){
    return "on "+date.getDate() + "/"+date.getMonth()
  }
  return d
}