/**
 * 时间转换
 * @param {*} date 国际时间 
 * @returns 
 */
export function formatDate (date) {
  var date1 = new Date(date);
  var myyear = date1.getFullYear();
  var mymonth = date1.getMonth() + 1;
  var myweekday = date1.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return myyear + "-" + mymonth + "-" + myweekday;
}