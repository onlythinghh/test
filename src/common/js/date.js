/**
 * Created by Administrator on 2017/3/31.
 */
export  function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {   //年份
    fmt = fmt.replace(RegExp.$1,date.getFullYear()+'').substr(4-RegExp.$1.length);
  }
  let  o = { //月 天 时 分 秒
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o){
    if(new RegExp(`(${k})`).test(fmt)){
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1) ? str : padLeftZero(str))
    }
  }
  return fmt;
};
function padLeftZero(str) {   //补零
  return ('00'+str).substr(str.length);
}