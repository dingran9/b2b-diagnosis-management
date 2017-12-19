/**
 * Created by achen on 2017/6/6.
 */
import axios from 'axios';
// 超时时间
axios.defaults.timeout = 30000;
axios.defaults.params = {
  requestId: Math.random()
};
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';

// http请求拦截器
axios.interceptors.request.use(config => {
  let user = localData.get('webTeacherUser');
  if (user && user.token) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.token = user.token;
    config.headers.userId = user.userId;
  }
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {
  // 响应成功
  if (data.data.httpCode === "600002") {
    window.location.href = window.location.href.split("#")[0] + "#/login";
  }
  return data.data;
}, error => {
  return Promise.reject(error)   // 返回接口返回的错误信息
})
export var $regexp = ({
  isMobile: value => /^1[34578]\d{9}$/.test(value),
  isCode: value => /^\d{6}&/.test(value)
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
export var $user = () => ({
  get: () => localData.get('webTeacherUser'),
  set: (user) => localData.set('webTeacherUser', user)
});
export var strToUrl = (str) => {
  if (!str || typeof str != "string") return "";
  str = str.toString();
  //如果已经是html格式  直接返回
  if (/<img\b[^>]*>|<audio\b[^>]*>/.test(str)) return str;
  return str.replace(/http:\/\/.*?\.(mp3|jpg|jpeg|png|gif)/ig, function (w) {
    if (/mp3$/i.test(w)) {
      return '<audio src=' + w + ' controls />'
    } else {
      return '<img style=max-width:100%;vertical-align:middle;  src=' + w + ' />'
    }
  }).replace(/\n/g, '<br />').replace(/\\n/g, '<br />')
};
export var htmlToImgStr = (str) => {
  //匹配图片（g表示匹配所有结果i表示区分大小写）
  var imgReg = /<img.*?(?:>|\/>)/gi;
  //匹配src属性
  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  //找到匹配的图片标签数组
  var imgArr = str.match(imgReg);
  var imgHttpUrlArr = [];
  //找到被标签分割的字符串
  var strArr = str.split(imgReg);
  var dealStr = "";

  //判断是否存在img标签,不存在为null
  if (imgArr) {
    //处理图片
//			console.log(imgArr);
//			console.log(strArr);
    //从图片数组中提取src地址
    for (var i = 0; i < imgArr.length; i++) {
      var src = imgArr[i].match(srcReg);
//				console.log(i,src[1]);
      //获取图片地址
      if (src[1]) {
        imgHttpUrlArr.push(src[1]);
      } else {
        imgHttpUrlArr.push("");
      }
    }
//			console.log(imgHttpUrlArr);
    //进行字符串的拼接
    for (var j = 0; j < strArr.length; j++) {
      if (j == imgHttpUrlArr.length) {
        dealStr = dealStr + strArr[j];
      } else {
        dealStr = dealStr + strArr[j] + imgHttpUrlArr[j]
      }
    }
//			console.log(dealStr);
    return dealStr;
  } else {
    //返回原字符串,无img标签
//			console.log(str);
    return str;
  }
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
};
export var stageCode = (canshu) => {
  if (canshu >= 11 && canshu <= 16) return 1;//小学
  else if (canshu >= 21 && canshu <= 24) return 2;//初中
  else if (canshu >= 31 && canshu <= 34) return 3;//高中
  else return 0;
}
export var questionTypeCode = {
  '1': '单选题',
  '2': '多选题',
  '3': '判断题',
  '4': '填空题',
  '5': '主观题',
  '6': '复合题',
}
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
export let $$user = () => localData.get('webTeacherUser') || {};
let teacherId = () => $$user().userId;
let filterSend = (send) => {
  return Object.assign(send, {
    userId: teacherId()
  })
}
var rootUrl, rootUrl1
if (location.hostname == 'diagnosismanager.e-eduspace.com') {
  rootUrl = 'http://diagnosismanager.e-eduspace.com/';
  rootUrl1 = 'http://diagnosisprotal.e-eduspace.com/';
} else if (location.hostname == 'testdiagnosismanager.e-eduspace.com') {
  rootUrl = 'http://testdiagnosismanager.e-eduspace.com/';
  rootUrl1 = 'http://testdiagnosisprotal.e-eduspace.com/';
} else if (location.hostname == 'demo.e-eduwisdom.com') {   //11月14日演示版本
  rootUrl = 'http://demo.e-eduwisdom.com/';
  rootUrl1 = 'http://demoprotal.e-eduwisdom.com/';
} else {
  rootUrl = 'http://diagnosismanagertest.e-eduwisdom.com/';  //教师
  rootUrl1 = 'http://diagnosisprotaltest.e-eduwisdom.com/';  //学生
}
//rootUrl = 'http://demo.e-eduwisdom.com/';
// export var rootUrl = 'http://demo.e-eduwisdom.com/';
export var rootUrl = 'http://diagnosismanagertest.e-eduwisdom.com/';

function user() {
  return $user().get();
}

export var $ajax = {
  //test
  test() {
    return axios.post(rootUrl + "teacher/diagnosis/getTeacherDiagnosisListV2", ({
      "classCodes": [1054, 1055, 1056, 1057],
      "teacherCode": 613,
      "schoolCode": 920,
      "subjectCode": 3,
      "pageNum": 1,
      "pageSize": 1
    }))
  },
  //登录
  login(sendData) {
    return axios.post(rootUrl + "login/userLogin", sendData)
  },
  //获取老师信息
  getTeacherInfo(sendData) {
    return axios.post(rootUrl + "userManager/getTeacherInfo", sendData)
  },
  //修改老师信息
  updateTeacherInfo(sendData) {
    return axios.post(rootUrl + "/userManager/updateTeacherInfo", filterSend(sendData))
  },
  //获取班级
  getClassByTeacher(sendData) {
    return axios.post(rootUrl + "userManager/getClassByTeacher", sendData)
  },
  //获取班级学生
  getStudentListByClassId(sendData) {
    return axios.post(rootUrl + "userManager/getStudentListByClassId", sendData)
  },
  //获取错题记录
  getWrongQuestions(sendData) {
    return axios.post(rootUrl + "wrongQuestion/getWrongQuestions", sendData)
  },
  //踢出学生
  kickOutStudent(sendData) {
    return axios.post(rootUrl + "authorize/deleteStudentGroupInfo", sendData)
  },
  //获取学科
  getSchoolSubjectList(sendData) {
    return axios.post(rootUrl + "groupManager/getSchoolSubjectList", sendData)
  },
  //获取试卷
  getTeacherDiagnosisListV2(sendData) {
    let _user = user();
    return axios.post(rootUrl + "teacher/diagnosis/getTeacherDiagnosisListV2", Object.assign({}, {
        classCodes: _user.classBeanList.map(item => item.classId),
        teacherCode: _user.userId,
        schoolCode: _user.userSchoolId,
        subjectCode: _user.userSubject
      },
      sendData,
    ))
  },
  //老师提交判卷信息
  saveMarkPaperInfo(sendData) {
    return axios.post(rootUrl + "teacher/markPaper/saveMarkPaperInfo", Object.assign({}, sendData))
  },
  //获取判卷详情
  getTeacherMarkPaperDetail(sendData) {
    return axios.post(rootUrl + "teacher/markPaper/getMarkResult", sendData)
  },
  //教师判卷功能-获取学生答题信息
  getPaperAndAnswerResult(sendData) {
    let _user = user();
    return axios.post(rootUrl + "teacher/markPaper/getPaperAndAnswerResult", Object.assign({}, sendData, {}))
  },
  //判卷功能-获取学生考试记录
  getStudentExamList(sendData) {
    let _user = user();
    return axios.post(rootUrl + "teacher/markPaper/studentExamList", Object.assign({}, sendData, {
      classCodes: _user.classBeanList.map(item => item.classId),
      // teacherCode:_user.userId,
      // schoolCode:_user.userSchoolId,
      subjectCode: _user.userSubject
    }))
  },
  //获取报告详情（小报告列表）
  getDiagnosisDetail(sendData) {
    return axios.post(rootUrl + "teacher/diagnosis/getDiagnosisDetail", sendData)
  },
  //获取教材
  getmaterialVersion(sendData) {
    return axios.post(rootUrl + "groupManager/getmaterialVersion", sendData)
  },
  //获取教材版本
  getVolume(sendData) {//20171019换接口teacher/rescours/getbookTypeVersionAndUnit为teacher/rescours/getVolume
    return axios.post(rootUrl + "teacher/rescours/getVolume", sendData)
  },
  //获取教材版本
  getbookTypeVersionAndUnit(sendData) {//20171019换接口teacher/rescours/getbookTypeVersionAndUnit为teacher/rescours/getVolume
    return axios.post(rootUrl + "teacher/rescours/getbookTypeVersionAndUnit", sendData)
  },
  //获取试卷列表
  getDiagnosisPaperByPaper(sendData) {
    return axios.post(rootUrl + "manager/teacher/getDiagnosisPaperByPaper", sendData)
  },
  //获取试卷详情
  paperDetail(sendData) {
    return axios.post(rootUrl + "teacher/diagnosis/paperDetail", sendData)
  },
  //发送试卷
  release(sendData) {
    return axios.post(rootUrl + "teacher/diagnosis/release", sendData)
  },
  //reportDetailsTotal下class1-7通用的get请求
  getCommonGet(getUrl) {
    let kkk = rootUrl + getUrl + '/' + JSON.parse(window.localStorage.getItem('webTeacherUser')).userId + '/' + JSON.parse(window.localStorage.getItem('reportData')).subjectCode + '/' + JSON.parse(window.localStorage.getItem('reportData')).code;
    return axios.get(kkk);
  },
  //reportDetailsClass用的get请求
  getCommon2Get(getUrl) {
    let subjectCode = JSON.parse(window.localStorage.getItem('reportData')).subjectCode || JSON.parse(window.localStorage.getItem('webTeacherUser')).userSubject;
    let kkk = rootUrl + getUrl + '/' + JSON.parse(window.localStorage.getItem('webTeacherUser')).userId + '/' + subjectCode + '/' + JSON.parse(window.localStorage.getItem('reportData')).code + '/' + JSON.parse(window.localStorage.getItem('reportData')).classCode;
    return axios.get(kkk);
  },

  /*学科测评*/
  //获取报告列表
  getDiagnosisListForMaster(sendData) {
    let _user = user();
    return axios.post(rootUrl + "teacher/diagnosis/getDiagnosisListForMaster", JSON.stringify(Object.assign({}, sendData, {
      classCodes: _user.classBeanList.map(item => item.classId),
      teacherCode: _user.userId,
      schoolCode: _user.userSchoolId,
      subjectCode: _user.userSubject
    })))
  },
  //获取学科
  getSubjectsForExam(sendData) {
    return axios.post(rootUrl + "teacher/diagnosis/getSubjectsForExam", sendData)
  },
  //教师报告----》班级标准分历史变动
  getStandardChangeScore(send) {
    let {subjectCode} = send, releaseExamCode = send.code,
      teacherCode = localData.get('getTeacherInfo').userId;
    let type = window.localStorage.page == "disciplineEvaluation" ? 1 : 0;
    return axios.get(rootUrl + `teacherReport/getStandardScoreChange/${teacherCode}/${subjectCode}/${releaseExamCode}/${type}`)
  },
  //获取课中测试列表
  getKezhongtlist(sendData) {
    return axios.post(rootUrl + "class/test/classTestList", sendData)
  },
  //获取课中测试列表
  classTestList(sendData) {
    return axios.post(rootUrl + "class/test/classTestList", sendData)
  },
  //课中测-班级总览
  classTestClassReportOverview(sendData) {
    return axios.post(rootUrl + "class/test/report", sendData)
  },
  //获取老师下的班级
  getTeacherClass(sendData) {
    return axios.post(rootUrl + "userManager/getClassByTeacher", sendData)
  },
  //获取题库左侧列表
  getQuestiontest(sendData) {
    return axios.post(rootUrl + "question/bank/questionBankList", sendData)
  },
  //获取右侧问题题库
  getQuestionlist(sendData) {
    return axios.post(rootUrl + "question/bank/baseQuestionList", sendData)
  },
  //获取开始测试题
  getByClassTestCode(sendData) {
    return axios.post(rootUrl + "class/test/baseQuestionListByClassTestCode", sendData)
  },
  //获取教材版本
  getmanagerMaterial(sendData) {
    return axios.post(rootUrl + "groupManager/managerMaterial", sendData)
  },
  //获取树形知识点
  getKnowledge(sendData) {
    return axios.post(rootUrl + "question/bank/getKnowledge", sendData)
  },
  //获得易教题库
  getQuestionByKnowledge(sendData) {
    return axios.post(rootUrl + "question/bank/getQuestionByKnowledge", sendData)
  },
  //添加题库
  questionBankSave(sendData) {
    return axios.post(rootUrl + "question/bank/questionBankSave", sendData)
  },
  //删除题库
  questionBankDelete(sendData) {
    return axios.post(rootUrl + "question/bank/questionBankDelete", sendData)
  },
  //课中测-获取基础卷code列表
  baseQuestionCodeListByClassTestCode(sendData) {
    return axios.post(rootUrl + "class/test/baseQuestionCodeListByClassTestCode", sendData)
  },
  //课中测-单题报告
  classTestRelationSingleReport(sendData) {
    return axios.post(rootUrl + "class/test/classTestRelationSingleReport", sendData)
  },
  //获取课中测试单体报告
  getSingleReport(sendData) {
    return axios.post(rootUrl + 'class/test/classTestRelationSingleReport', sendData)
  },
  //新建课中测—保存
  getclassTestSave(sendData) {
    return axios.post(rootUrl + 'class/test/classTestSave', sendData)
  },
  //继续测试
  getTestUpdate(sendData) {
    return axios.post(rootUrl + 'class/test/classTestUpdate', sendData)
  },
  //查看测试题
  getbaseQuestion(sendData) {
    return axios.post(rootUrl + 'class/test/baseQuestionListByClassTestCode', sendData)
  },
  //个人题库修改信息
  questionBankUpdate(sendData) {
    return axios.post(rootUrl + 'question/bank/questionBankUpdate', sendData)
  },
  //易教题库添加到我的题库
  baseQuestionSave(sendData) {
    return axios.post(rootUrl + 'question/bank/baseQuestionSave', sendData)
  },
  //修改题库
  baseQuestionUpdate(sendData) {
    return axios.post(rootUrl + 'question/bank/baseQuestionUpdate', sendData)
  },
  //个人题库问题删除
  baseQuestionDelete(sendData) {
    return axios.post(rootUrl + 'question/bank/baseQuestionDelete', sendData)
  },
  //删除当前测试题
  getDeleteTest(sendData) {
    return axios.post(rootUrl + 'class/test/classTestDelete', sendData)
  },
  //开始测试第一个接口
  getTeststepone(sendData) {
    return axios.post(rootUrl + 'class/test/classTestUpdate', sendData)
  },
  //得到答题器设备
  getAnswerMachine(sendData) {
    return axios.post(rootUrl + 'answer/machine/start', sendData)
  },
  //结束本题并查看报告
  getBasictopic(sendData) {
    return axios.post(rootUrl + 'class/test/classTestRelationUpdate', sendData)
  },
  //继续测试
  getContinuetest(sendData) {
    return axios.post(rootUrl + 'class/test/unlockClassTest', sendData)
  },
  //gei给学生绑定答题器
  manageStudentAnswerMachine(sendData) {
    return axios.post(rootUrl + 'answer/machine/save', sendData)
  },
  //检测答题器是否链接
  getMachine(sendData) {
    return axios.post(rootUrl + 'answer/machine/verification', sendData)
  },
  //答题器结束考试
  getMachinecollect(sendData) {
    return axios.post(rootUrl + 'answer/machine/collect', sendData)
  },
  //查看报告判断是否有人答题
  reportVerification(sendData) {
    return axios.post(rootUrl + 'class/test/reportVerification', sendData)
  },
  //答题器获取设备sn
  getBaseId(sendData) {
    return axios.post(rootUrl + 'answer/machine/getBaseId', sendData)
  },
  //获取自主组卷列表
  getSelfPaperList(sendData) {
    let _user = user();
    return axios.post(rootUrl + "MyPaper/getBasePaperList", Object.assign({}, {
        // classCodes: _user.classBeanList.map(item => item.classId),
        operatorCode: _user.userId,
        // schoolCode: _user.userSchoolId,
        // subjectCode: _user.userSubject
      },
      sendData,
    ))
  },
  //获取自主组卷详情
  getSelfPaperDetail(sendData) {
    return axios.get(rootUrl + "MyPaper/getBriefInfor/" + sendData)
  },
  //改变自主组卷状态
  changeSelfPaperStatus(sendData) {
    return axios.get(rootUrl + "MyPaper/modifyBasePaperStatus/" + sendData.id + "/" + sendData.toStatus)
  },
  getBaseId(sendData) {
    return axios.post(rootUrl + 'answer/machine/getBaseId', sendData)
  },
  //获取试题分类
  getQuestionType(sendData) {
    return axios.get(rootUrl + 'resource/getQuestionType/' + sendData)
  },
  //获取易教题库
  getResourceQuestions(sendData) {
    return axios.post(rootUrl + 'resource/getResourceQuestions', sendData)
  },
  //展示试卷
  showPaper(paperCode) {
    return axios.post(rootUrl + 'resource/showPaper/' + paperCode)
  },
  //获取试卷详情
  getResourcePaper(sendData) {
    return axios.post(rootUrl + 'teacher/rescours/getResourcePaper', sendData)
  },
  //课中测-酷神笔-单题报告-dhl
  classTestGodPenRelationSingleReport(sendData) {
    return axios.post(rootUrl + 'class/test/classTestGodPenRelationSingleReport', sendData)
  },
  //易教试卷左侧列表
  getbookTypeVersionAndUnit(sendData) {
    return axios.post(rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit', sendData)
  },
  //易教试卷单元列表
  getPaperByUnit(sendData) {
    return axios.post(rootUrl + 'teacher/rescours/getPaperByUnit', sendData)
  },
  //易教试卷详情
  getResourcePaper(sendData) {
    return axios.post(rootUrl + 'teacher/rescours/getResourcePaper', sendData)
  },
  //易教试卷保存
  getTestPaperSave(sendData) {
    return axios.post(rootUrl + 'class/test/classTestPaperSave', sendData)
  },
  //获取学生排行
  getStudentRank(send) {
    return axios.post(rootUrl + 'class/test/getStudentRinkingList', send)
  },
  //获取学生报告
  studentClassTestClassReport(send) {
    return axios.post(rootUrl + 'class/test/getStudentClassTestReport', send)
  },
  //获取试卷知识点教材树
  getResourceKnowledgeTree(sendData) {
    return axios.post(rootUrl + 'resource/getResourceKnowledgeTree', sendData)
  },
  //新建试卷
  saveMyPaper(sendData) {
    return axios.post(rootUrl + 'MyPaper/saveMyPaper', sendData)
  },
  //修改试卷
  updateMyPaper(urlParams, sendData) {
    return axios.post(rootUrl + 'MyPaper/updateMyPaper/' + urlParams, sendData)
  },
  //新建课中测点击下一步校验名称是否存在
  getCheckname(sendData){
    return axios.post(rootUrl + 'class/test/classTestCheckeName', sendData)
  },
  //教师端报告修改-获取试卷，排行榜
  getTeacherClassTestReport(sendData){
    return axios.post(rootUrl + 'class/test/getTeacherClassTestReport', sendData)
  },
  //教师端报告修改卷-获取学生的答题情况
  getStudentsAnswerQuestionsDetails(sendData){
    return axios.post(rootUrl + 'class/test/getStudentsAnswerQuestionsDetails', sendData)
  },
  //老师端-发布作业
  saveTask(sendData){
    return axios.post(rootUrl + 'task/saveTask', sendData)
  },
  ...require('./extendAjax').default(rootUrl),
}
export let isEmptyObject = (obj) => {
  for (let key in obj) {
    return false
  }
  ;
  return true
}


