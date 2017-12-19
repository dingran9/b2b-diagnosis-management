export function filterListToObjList(data, key) {
  let result = {};
  data.forEach(item => {
    if (result[item[key]]) {
      result[item[key]].push(item);
    } else {
      result[item[key]] = [item];
    }
  })
  return Object.keys(result).map(item => {
    return {
      key: item,
      val: result[item]
    }
  })
}

export function $copy(obj, ...proto) {
  var temp = {};

  function isObj(obj) {
    return typeof obj === 'object' && obj !== null;
  }

  if (isObj(obj)) {
    proto.map(item => {
      if (isObj(item)) {
        if (Array.isArray(item)) {
          Object.assign(temp, $copy(obj, ...item));
        } else {
          for (let key in item) {
            temp[key] = obj[item[key]];
          }
        }
      } else {
        temp[item] = obj[item];
      }
    })
  }
  return temp;
}

export var dateParse = (date, fmt) => {
  date = date instanceof Date ? date : new Date(+date);
  if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss';
  let o = {
    '(Y|y)+': date.getFullYear(),
    '(M)+': date.getMonth() + 1,
    '(D|d)+': date.getDate(),
    '(h|H)+': date.getHours(),
    '(m)+': date.getMinutes(),
    '(s|S)+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : str.length > 2 ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
}

export var getContrastType = type => {
  let contrastType = "GRADE_CONTRAST";
  switch (type) {
    case 1:
      contrastType = "GRADE_CONTRAST";
      break;
    case 2:
      contrastType = "SCHOOL_CONTRAST";
      break;
    case 3:
      contrastType = "CLASS_CONTRAST";
      break;
    case 4:
      contrastType = "TEACHER_CONTRAST";
      break;
  }
  return {contrastType}
}


export var mopObj = (obj, key) => {
  try {
    obj = Object.assign({}, obj);
    let temp = obj[key];
    delete obj[key];
    return temp.map(item => {
      return {...obj, ...item}
    })
    return obj;
  } catch (e) {
    return[];
  }
}

