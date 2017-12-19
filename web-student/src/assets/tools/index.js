/**
 * Created by achen on 2017/6/22.
 */
/**
 * Created by achen on 2017/6/6.
 */
import axios from 'axios';
// 超时时间
axios.defaults.timeout = 5000;
axios.defaults.params = {
  requestId: Math.random()
}
// http请求拦截器
axios.interceptors.request.use(config => {
  let user = localData.get('web-user');
  if (user && user.token) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.token = user.token;
    config.headers.openId = user.openId;
  }

  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {
  // 响应成功
  if (data.data.httpCode === "600002") {
    window.location.href = 'index.html';
  }
  return data.data;
}, error => {
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 401:
  //       // 返回 401 清除token信息并跳转到登录页面
  //       store.commit(types.LOGOUT);
  //       router.replace({
  //         path: 'login',
  //         query: {redirect: router.currentRoute.fullPath}
  //       })
  //   }
  // }
  return Promise.reject(error)   // 返回接口返回的错误信息
})
export var $regexp = ({
  isMobile: value => /^1[34578]\d{9}$/.test(value),
  isCode: value => /^\d{6}$/.test(value)
})
export var dataParse = (value) => {
  let time = new Date(parseInt(value));

  function minTen(num) {
    return num > 9 ? num : '0' + num;
  }

  return time.getFullYear() + "-" + minTen(time.getMonth() + 1) + "-" + minTen(time.getDate()) + " " + minTen(time.getHours()) + ":" + minTen(time.getMinutes());
}
export var localData = {
  get(name) {
    if (!name) return null;
    return JSON.parse(localStorage.getItem(name));
  },
  set(name, obj) {
    if (!name) return;
    localStorage.setItem(name, JSON.stringify(obj));
  },
  delete(name) {
    localStorage.removeItem(name);
  }
};
//会话缓存
export var sessionData = {
  get(name) {
    if (!name) return null;
    return JSON.parse(sessionStorage.getItem(name));
  },
  set(name, obj) {
    if (!name) return;
    sessionStorage.setItem(name, JSON.stringify(obj));
  },
  delete(name) {
    sessionStorage.removeItem(name);
  }
};

export var strToUrl = (str) => {
  if (!str || typeof str != "string") return "";
  str = str.toString();
  //如果已经是html格式  直接返回
  if (/<img\b[^>]*>|<audio\b[^>]*>/.test(str)) return str;
  return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function (w) {
    if (/mp3$/i.test(w)) {
      return '<audio src=' + w + ' controls />'
    } else {
      return '<img style=max-width:100%;vertical-align: middle;  src=' + w + ' />'
    }
  }).replace(/\n/g, '<br />').replace(/\\n/g, '<br />')
};

export var commonGrond = {
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
};

export var commonSubject = {
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


export const parseJSON = (str) => {
  try {
    return (eval("(" + str + ")"));
  } catch (e) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
};
export const forEachQuestions = (paperData, cb, cb2, config = {}) => {
  Object.assign(config, {
    firstName: 'paperSystemQusetionType',
    secondName: 'typeList',
    thirdName: 'list',
    fourthName: 'componentQuestions'
  });
  try {
    paperData[config.firstName].map((questionCollection, indexOfQuestionCollection) => {
      questionCollection[config.secondName].map((questionType, indexOfQuestionType) => {
        questionType[config.thirdName].map((question, indexOfQuestion) => {
          let indexWrap = {
            firstIndex: indexOfQuestionCollection,
            secondIndex: indexOfQuestionType,
            thirdIndex: indexOfQuestion,
          };
          if (questionCollection.type != 6) {
            cb && cb(question, questionCollection.type, indexWrap)
          } else {
            cb2 && cb2(question, questionCollection.type, indexWrap)
            console.log(question);
            question[config.fourthName].map((lolLevelQuestion, indexOfLolLevelQuestion) => {
              indexWrap.fourthIndex = indexOfLolLevelQuestion;
              cb && cb(lolLevelQuestion, questionCollection.type, indexWrap);
            })
          }
        })
      });

    })
  } catch (e) {
    console.log(e);
  } finally {
    return paperData;
  }
}


export var $user = () => ({
  get: () => localData.get('web-user') || {},
  set: (user) => localData.set('web-user', user)
});

export var filterStrToUrlData = (str) => {
  return parseJSON(strToUrl(str));
}
const resolveOneQuestion = (temp, questionType, option) => {
  function filterStrToObj(str) {
    let temp = parseJSON(strToUrl(str));
    return temp || [];
  }

  temp.stem = strToUrl(temp.stem);
  temp.quesOption = filterStrToObj(temp.quesOption);
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


var rootUrl, rootUrl1, baseURL = (() => {
  if (location.hostname == 'localhost') {
    /* 测试环境*/
    return 'http://211.157.179.213';
    // /*prod   产品演示环境*/
    return 'http://diagnosismanager.e-eduspace.com';
  }
  return location.protocol + '//' + location.hostname;
})();

if (baseURL == 'http://diagnosismanager.e-eduspace.com') {
  rootUrl = 'http://diagnosismanager.e-eduspace.com/';
  rootUrl1 = 'http://diagnosisprotal.e-eduspace.com/';
} else if (baseURL == 'http://testdiagnosismanager.e-eduspace.com') {
  rootUrl = 'http://testdiagnosismanager.e-eduspace.com/';
  rootUrl1 = 'http://testdiagnosisprotal.e-eduspace.com/';
} else if (baseURL == 'http://demo.e-eduwisdom.com') {
  //11月14日演示版本
  rootUrl = 'http://demo.e-eduwisdom.com/';
  rootUrl1 = 'http://demoprotal.e-eduwisdom.com/';
} else {
  rootUrl = 'http://diagnosisprotaltest.e-eduwisdom.com/';
  rootUrl1 = 'http://diagnosisprotaltest.e-eduwisdom.com/';
  rootUrl = 'http://demo.e-eduwisdom.com/';
  rootUrl1 = 'http://demoprotal.e-eduwisdom.com/';
}
export var rootUrl = rootUrl;
export var rootUrl1 = rootUrl1;
export var $ajax = {
  //登录
  login(sendData) {
    return axios.post(rootUrl1 + "user/login", sendData)
  },
  //获取学生学科
  getSubjects(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/initExamList", sendData)
  },
  //获取课中测列表
  getClassTestList(sendData) {
    return axios.post(rootUrl1 + "class/test/classTestList", sendData)
  },
  //获取试卷
  getPaper(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/paperDetail", sendData)
  },
  //获取学生学科测评列表
  getTestList(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/examList", sendData)
  },
  //提交答题卡
  commitAnswer(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/submit", sendData)
  },
  //获取报告
  getReportDetail(sendData) {
    return axios.get(rootUrl1 + "rest/report/getStudentReport/" + sendData.url, sendData)
  },
  //获取报告失败再次获取
  getReportDetail(sendData) {
    return axios.get(rootUrl1 + "rest/report/getStudentReport/" + sendData.url, sendData)
  },
  //获取试卷详情及其解析
  getPaperDetial(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/getPaperAndAnswerResult", sendData)
  },
  //获取视频资源
  getVideoByKnowledge(sendData) {
    return axios.post(rootUrl1 + "student/tutoring/getVideoByKnowledge", sendData)
  },
  //获取练一练
  getknowledgequestion(sendData) {
    return axios.post(rootUrl1 + "student/tutoring/getQuestionsByVideo", sendData)
  },
  //获取学科测评列表
  complexExamList(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/complexExamList", sendData)
  },
//获取学科测评列表 -> 学科考试列表
  complexSubjectExamList(sendData) {
    return axios.post(rootUrl1 + "student/diagnosis/complexSubjectExamList", sendData)
  },
  //获取收藏试题
  getFavouriteQuestion(sendData) {
    return axios.post(rootUrl1 + "user/getDiagnosisFavoritePaper", sendData)
  },
  //获取错题记录
  getWrongQuestions(sendData) {
    return axios.post(rootUrl1 + "wrongQuestion/getWrongQuestions", sendData)
  },
  //删除错题记录
  deleteWrongQuestions(sendData) {
    return axios.post(rootUrl1 + "wrongQuestion/delWrongQuestions", sendData)
  },
  //修改密码  验证老密码
  checkOldPwd(sendData) {
    return axios.post(rootUrl1 + "user/chack/oldPwd", sendData)
  },
  //修改密码  确认老手机号的验证码
  commitCodeForOldPhone(sendData) {
    return axios.post(rootUrl1 + "/user/chack/code", sendData)
  },
  //修改手机号  发送验证码
  sendCodeForChangePhone(sendData) {
    return axios.post(rootUrl1 + "user/edit/phone/sms", sendData)
  },
  //修改手机号  修改手机号
  changePhone(sendData) {
    return axios.post(rootUrl1 + "user/edit/phone", sendData)
  },


  //修改密码  修改密码
  changePwd(sendData) {
    return axios.post(rootUrl1 + "user/pwd/edit", sendData)
  },
  //学生设置  模糊查询学校
  getSchool(sendData) {
    return axios.post(rootUrl1 + "user/getGroupByNameAndType", sendData)
  },
  // x学生设置  查询年级
  getGradeList(sendData) {
    return axios.post(rootUrl1 + "user/getGradeList", sendData)
  },
  // x学生设置  查询年级
  getClassList(sendData) {
    return axios.post(rootUrl1 + "user/getClassList", sendData)
  },
  // x学生设置  设置学生信息
  setUserInfo(sendData) {
    return axios.post(rootUrl1 + "user/stuUpdate", sendData)
  },

  // 绑定答题器
  studentBindAnsweringMachineSave(sendData) {
    let user = $user().get();
    let commonData = {
      "studentName": user.userName,
      "studentCode": user.userId,
    }
    return axios.post(rootUrl1 + "class/test/save", Object.assign({}, sendData, commonData))
  },
  // 获取学生绑定答题器信息
  studentBindAnsweringMachineList(sendData) {
    let user = $user().get();
    let commonData = {
      "studentName": user.userName,
      "studentCode": user.userId,
    }
    return axios.post(rootUrl1 + "class/test/list", Object.assign({}, commonData, sendData))
  },
  // 获取学生课中测报告
  studentClassTestClassReport(sendData) {
    let user = $user().get();
    let commonData = {
      "studentCode": user.userId,
    }
    return axios.post(rootUrl1 + "class/test/report", Object.assign({}, commonData, sendData))
  },
  // 获取课中测试题
  getKezhongcePaperDetail(sendData) {
    let user = $user().get();
    let commonData = {
      "studentCode": user.userId,
    }
    return axios.post(rootUrl1 + "class/test/questionDetails", Object.assign({}, commonData, sendData))
  },
  // 获取课中测报告   神笔
  getKezhongcePaperDetail2(sendData) {
    let user = $user().get();
    let commonData = {
      "studentCode": user.userId,
      studebftCode: user.userId,
    }
    return axios.post(rootUrl1 + "class/test/getPaperAndAnswerResult", Object.assign({}, commonData, sendData))
  },
  // 获取课中测报告   神笔
  reportByGodPenAccuracy(sendData) {
    let user = $user().get();
    let commonData = {
      "studentCode": user.userId,
      studebftCode: user.userId,
    }
    return axios.post(rootUrl1 + "class/test/reportByGodPenAccuracy", Object.assign({}, commonData, sendData))
  },
// 获取课中测试题详情
  getPaperAndAnswer(sendData) {
    let user = $user().get();
    let commonData = {
      "studentCode": user.userId,
      studebftCode: user.userId,
    }
    return axios.post(rootUrl1 + "class/test/getPaperAndAnswerResult", Object.assign({}, commonData, sendData))
  },
	getTaskListByInClassTest(sendData){
    return axios.post(rootUrl1 + 'class/test/getTaskListByInClassTest',sendData)
  },
  getTaskInfoByInClassTest(sendData){
    return axios.post(rootUrl1 + 'class/test/getTaskInfoByInClassTest',sendData)
  },
  saveTaskInfoByInClassTest(sendData){
    return axios.post(rootUrl1 + 'class/test/saveTaskInfoByInClassTest',sendData)
  },

}
console.log($user().get());


