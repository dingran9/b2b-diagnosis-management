/**
 * 获取服务器地址
 */
export const rootUrls = (()=>{
  if (location.hostname == 'localhost'||location.hostname == '127.0.0.1'||location.hostname == '192.168.1.51') {
    /* 开发环境*/
    // return {
    //   'rootUrl':'http://211.157.179.220:8866/',
    //   'rootUrl1':'http://211.157.179.220:9999/',
    // };
    return  {
      // 'rootUrl':'http://diagnosismanagertest.e-eduwisdom.com/',
      // 'rootUrl1':'http://diagnosisprotaltest.e-eduwisdom.com/',
      'rootUrl':'http://demo.e-eduwisdom.com/',
      'rootUrl1':'http://demo.e-eduwisdom.com/',
    };
    /* 线上环境*/
    return {
      'rootUrl':'http://diagnosismanager.e-eduspace.com/',
      'rootUrl1':'http://diagnosisprotal.e-eduspace.com/'
    }
  }
  if (location.hostname == 'diagnosismanager.e-eduspace.com') {
    return {
      'rootUrl':'http://diagnosismanager.e-eduspace.com/',
      'rootUrl1':'http://diagnosisprotal.e-eduspace.com/'
    }
  }
  if (location.hostname == 'diagnosismanager.e-eduwisdom.com') {
    return {
      'rootUrl':'http://diagnosismanager.e-eduwisdom.com/',
      'rootUrl1':'http://diagnosisprotal.e-eduwisdom.com/'
    }
  }
  if (location.hostname == '211.157.179.213' || location.hostname == 'diagnosismanagertest.e-eduwisdom.com') {
    return  {
      'rootUrl':'http://diagnosismanagertest.e-eduwisdom.com/',
      'rootUrl1':'http://diagnosisprotaltest.e-eduwisdom.com/',
    };
  }
  if (location.hostname == '211.157.179.220') {
    return {
      'rootUrl':'http://211.157.179.220:8866/',
      'rootUrl1':'http://211.157.179.220:9999/',
    };
  }
  if (location.hostname == 'testdiagnosismanager.e-eduspace.com') {
    return {
      'rootUrl':'http://testdiagnosismanager.e-eduspace.com/',
      'rootUrl1':'http://testdiagnosisprotal.e-eduspace.com/'
    }
  }
  if (location.hostname == 'demo.e-eduwisdom.com') {
    return {
      'rootUrl':'http://demo.e-eduwisdom.com/',
      'rootUrl1':'http://demoprotal.e-eduwisdom.com/'
    }
  }
})();

/**
 * 公共变量
 */
export const commonGroundCode = [
  {code: 11, name: '一年级'},
  {code: 12, name: '二年级'},
  {code: 13, name: '三年级'},
  {code: 14, name: '四年级'},
  {code: 15, name: '五年级'},
  {code: 16, name: '六年级'},
  {code: 21, name: '七年级'},
  {code: 22, name: '八年级'},
  {code: 23, name: '九年级'},
  {code: 31, name: '高一'},
  {code: 32, name: '高二'},
  {code: 33, name: '高三'},
]
export const commonGrond = {
  '11': '一年级',
  '12': '二年级',
  '13': '三年级',
  '14': '四年级',
  '15': '五年级',
  '16': '六年级',
  '21': '七年级',
  '22': '八年级',
  '23': '九年级',
  '31': '高一',
  '32': '高二',
  '33': '高三',
  '24': '中考'
}
export const commonSubject = {
  '1': '语文',
  '2': '数学',
  '4': '物理',
  '3': '英语',
  '5': '化学',
  '6': '生物',
  '7': '历史',
  '8': '地理',
  '9': '政治',
  '10': '科学',
  '11': '信息技术',
  '12': '品德与生活',
  '13': '品德与社会',
  '14': '思想品德',
  '15': '心理学',
  '16': '习惯趣谈'
}
export const othersContent = {
  colors:['#93bcf2', '#b8e4be', '#fbc05e', '#f5aaaa', '#fbe083', '#d9a1eb',
    '#fc898f', '#949dd4', '#bdaddb','88dbf3'],
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 获取本地用户信息
 */
export const getUser = name => {

  return JSON.parse(getStore('Userinfo'));
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop;
  }else if(element.currentStyle){
    target = element.currentStyle[attr];
  }else{
    target = document.defaultView.getComputedStyle(element,null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
}

/**
 * 获取年月日
 */
export const fTime = value =>{
  if (value) {
    let time = new Date(parseInt(value));
    let minutes = 0;
    function filterNum (num){
      return num < 10 ? "0" + num : num;
    }
    return time.getFullYear() + "-" + filterNum(time.getMonth() + 1) + "-" + filterNum(time.getDate()) + " " +filterNum(time.getHours()) + ":" +filterNum(time.getMinutes());
  } else {
    return "暂无"
  }
}

export var dataParse = (value) => {
  let time = new Date(parseInt(value));

  function minTen(num) {
    return num > 9 ? num : '0' + num;
  }

  return time.getFullYear() + "-" + minTen(time.getMonth() + 1) + "-" + minTen(time.getDate()) + " " + minTen(time.getHours()) + ":" + minTen(time.getMinutes());
}

/**
 * 获取学科
 */
export const fSubjectCode = value =>{
  value = parseInt(value)
  switch (value) {
    case 1:
      return '语文'
      break;
    case 2:
      return '数学'
      break;
    case 3:
      return '英语'
      break;
    case 4:
      return '物理'
      break;
    case 5:
      return '化学'
      break;
    case 6:
      return '生物'
      break;
    case 7:
      return '历史'
      break;
    case 8:
      return '地理'
      break;
    case 9:
      return '政治'
      break;
    default:
      return ''
  }
};

/**
 * 获取年级
 */
export const fGradeCode = value =>{
  value = parseInt(value)
  switch (value) {
    case 31:
      return '高一'
      break;
    case 32:
      return '高二'
      break;
    case 33:
      return '高三'
      break;
    case 21:
      return '初一'
      break;
    case 22:
      return '初二'
      break;
    case 23:
      return '初三'
      break;
    case 11:
      return '一年级'
      break;
    case 12:
      return '二年级'
      break;
    case 13:
      return '三年级'
      break;
    case 14:
      return '四年级'
      break;
    case 15:
      return '五年级'
      break;
    case 16:
      return '六年级'
      break;
    default:
      return ''
  }
};

/**
 * 获取年级
 */
export var strToUrl = (str) => {
  if (!str || typeof str != "string") return "";
  str = str.toString();
  return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function (w) {
    if (/mp3$/i.test(w)) {
      return "<audio src='" + w + "controls/>"
    } else {
      return "<img style='max-width:1000px;vertical-align: middle;' src='" + w + "'/>"
    }
  }).replace(/\n/g, "<br />")
};


//解析试题
export const parseJSON = (str) => {
  try {
    return (eval("(" + str + ")"));
  } catch (e) {
    return str;
  }
};
const resolveOneQuestion = (temp, questionType, option) => {
  function filterStrToObj(str) {
    let temp = parseJSON(strToUrl(str));
    if (Array.isArray(temp)) {
      for (let item of temp) {
        item.optionValue = (item.optionValue);
      }
    }
    return temp || [];
  }

  temp.stem = strToUrl(temp.stem);
  temp.quesOption = filterStrToObj(temp.quesOption);
  console.log(typeof temp.quesOption,temp.quesOption)
  temp.quesAnalyze = filterStrToObj(temp.quesAnalyze);
  temp.answer = filterStrToObj(temp.answer);
  temp.userAnswerResul = parseJSON(strToUrl(temp.userAnswerResul));
  if (option.type == 1) {
    //判卷   默认
    temp.isLock = false;
    if (temp.type == 2) {
      //多选题    自己计算分数
      temp.teacherScore = temp.score * computeRight(temp.answer, temp.userAnswerResul);
    } else {
      temp.teacherScore = '';
    }
  } else if (option.type == 2) {
    //查看
    temp.teacherScore = '' + temp.studentGetScore;
    temp.isLock = true;
  }
  return temp;
}
const computeRight = (trueAnswer, answer) => {
  if (!answer) return 0;
  if (answer.split(',').some(item => !trueAnswer.includes(item)))
    return 0;
  if (trueAnswer.split('').some(item => !answer.includes(item)))
    return .5;
  return 1;
}
const resolve = (questions, option) => {
  let type = questions.type;
  try {
    if (type == 6) {
      for (let typeList of questions.typeList) {
        for (let list of typeList.list) {
          list.stem = strToUrl(list.stem);
          for (let componentQuestions of list.componentQuestions) {
            resolveOneQuestion(componentQuestions, type, option);
          }
        }
      }
    } else {
      questions.typeList.map(item => {
        item.list.map(question => {
          resolveOneQuestion(question, type, option)
        })
      })
    }
  }
  catch (e) {
    console.log('类型' + type + '解析有问题')
  }
  return questions;

}

export let isEmptyObject = (obj) => {
  for (let key in obj) {
    return false
  };
  return true
}

/// 构造请求接口
export let getrequestInterface = (temp) => {

  let subjectCode = JSON.parse(window.localStorage.getItem('reportData')).subjectCode

  let teacherCode = JSON.parse(window.localStorage.getItem('reportData')).teacherCode

  let releaseExamCode = JSON.parse(window.localStorage.getItem('reportData')).releaseExamCode

  let path = temp + "/" + teacherCode + "/" + subjectCode + "/" + releaseExamCode

  var url = rootUrls.rootUrl + path + '?requestId=123';

  return url

}

export var resolveQuestion = (questions, option = {type: 1}) => {
  for (let value of questions) {
    resolve(value, option);
  }
  return questions;
}
export var getSendAnswer = (allQuestionList) => {
  let markAnswers = [];
  allQuestionList.forEach(item => {
    markAnswers.push(...getMarkAnswers(item));
  })
  return markAnswers;

  function getMarkAnswers(questionWrap) {
    let temp = [];
    try {
      questionWrap.typeList.map(questionTypeWrap => {
        questionTypeWrap.list.map(question => {
          temp.push(...getOneMarkAnswer(question, questionWrap.type));
        })
      })
    } catch (e) {
      console.log('类型' + questionWrap.type + '获取老师判卷有问题')
      console.log(e)
    }
    return temp;
  }

  function getOneMarkAnswer(question, type) {
    if (type == 6) {
      return question.componentQuestions.reduce((result, item) => {
        return result.concat(makeMarkAnswer(item, question));
      }, [])
    } else {
      return makeMarkAnswer(question);
    }
  }

  function makeMarkAnswer(question, questionWrap) {
    if (!question.isImg) return [];
    let markResult = !question.basetree.some(treeWrap => {
      return treeWrap.sons.some(tree => !tree.isRight)
    });
    question.basetree.map(
      basetreeWrap => {
        basetreeWrap.sons.map(tree => {
          question.tree.map(treeWrap => {
            let temp = treeWrap.sons.find(i => i.idVo == tree.idVo);
            temp && (temp.isRight = tree.isRight);
          })
        })
      }
    )

    return [{
      "questionScore": question.score,
      "answerRecordCode": question.answerRecordCode,
      "baseProduction": JSON.stringify(question.basetree),
      "productionKnowledge": JSON.stringify(question.tree),
      "complexQuestionCode": question.isComplex ? question.id : null,
      "isComplex": question.isComplex,
      "markResult": +markResult,
      "questionCode": question.isComplex ? questionWrap.id : question.id,
      "score": question.teacherScore,
    }]
  }

}
//解析试题结束

