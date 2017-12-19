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
  let user = $user().get() || {};
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
  get: () => localData.get('user344232'),
  set: (user) => localData.set('user344232', user),
  del:() => localData.delete('user344231')
});
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
    return str;
  }
};

export let $$user = () => localData.get('user344232') || {};
let teacherId = () => $$user().userId;
let filterSend = (send) => {
  return Object.assign(send, {
    userId: teacherId()
  })
}


var rootUrl, rootUrl1, baseURL = (() => {
  if (location.hostname == 'localhost') {
    /* 测试环境*/
    return 'http://211.157.179.213';
    /*dev  开发环境*/
    // return 'http://211.157.179.220';
    // /*prod   产品演示环境*/
    // return 'http://diagnosismanager.e-eduspace.com';
  } else if (location.hostname.indexOf("192.168") != -1) {
    return 'http://211.157.179.213';
  }
  return location.protocol + '//' + location.hostname;
})();

if (baseURL == 'http://diagnosismanager.e-eduspace.com') {
  rootUrl = 'http://diagnosismanager.e-eduspace.com/';
} else if (baseURL == 'http://testdiagnosismanager.e-eduspace.com') {
  rootUrl = 'http://testdiagnosismanager.e-eduspace.com/';
  rootUrl1 = 'http://testdiagnosisprotal.e-eduspace.com/';
}else if(baseURL == 'http://demo.e-eduwisdom.com'){   //11月14日演示版本
  rootUrl = 'http://demo.e-eduwisdom.com/';
  rootUrl1 = 'http://demoprotal.e-eduwisdom.com/';
}else {
  rootUrl = 'http://diagnosisprotaltest.e-eduwisdom.com/';
  rootUrl1 = 'http://diagnosisprotaltest.e-eduwisdom.com/';
}
export var rootUrl = 'http://demo.e-eduwisdom.com/';

function user() {
  return $user().get();
}

axios.defaults.baseURL = rootUrl;
export var $ajax = {
  ...require('./ajax').default,
  //登录
  login(sendData) {
    return axios.post(rootUrl + "authUserAuthority/login", sendData)
  },
  //获取老师信息
  getTeacherInfo(sendData) {
    return axios.post(rootUrl + "userManager/getTeacherInfo", sendData)
  },
  //修改老师信息
  updateTeacherInfo(sendData) {
    return axios.post(rootUrl + "/authUserAuthority/editPwd", filterSend(sendData))
  },
  //获取单元进度列表
  getScheduleList(sendData) {
    return axios.post(rootUrl + "/manager/teacher/getScheduleList", filterSend(sendData))
  },
  //创建单元进度
  saveAndUpdateUnitSchedule(sendData) {
    return axios.post(rootUrl + "/manager/teacher/saveAndUpdateUnitSchedule", filterSend(sendData))
  },
  //获取班级
  getClassByTeacher(sendData) {
    return axios.post(rootUrl + "userManager/getClassByTeacher", sendData)
  },
  //获取班级学生
  getStudentListByClassId(sendData) {
    return axios.post(rootUrl + "userManager/getStudentListByClassId", sendData)
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
    return axios.post(rootUrl + "teacher/markPaper/getPaperAndAnswerResult", Object.assign({}, sendData, {
      // classCodes:_user.classBeanList.map(item => item.classId),
      // teacherCode:_user.userId,
      // schoolCode:_user.userSchoolId,
      // subjectCode:_user.userSubject
    }))
  },
  //判卷功能-获取学生考试记录
  getStudentExamList(sendData) {
    let _user = user();
    return axios.post(rootUrl + "teacher/markPaper/studentExamList", Object.assign({}, sendData, {
      // classCodes:_user.classBeanList.map(item => item.classId),
      // teacherCode:_user.userId,
      // schoolCode:_user.userSchoolId,
      // subjectCode:_user.userSubject
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
  //获取教材版本单元
  getbookTypeVersionAndUnit(sendData) {
    return axios.post(rootUrl + "teacher/rescours/getbookTypeVersionAndUnit", sendData)
  },
  //区分是否有报告 ->获取教材版本单元
  getUnitListWithStatus(sendData) {
    return axios.post(rootUrl + "teacher/rescours/getUnitListWithStatus", sendData)
  },
  //获取教材版本
  getBookTypeVersion(sendData) {
    return axios.post(rootUrl + "teacher/rescours/getBookTypeVersion", sendData)
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


  /*学科测评*/
  //获取报告列表
  getDiagnosisListForMaster(sendData) {
    let _user = user();
    return axios.post(rootUrl + "teacher/diagnosis/getDiagnosisListForMaster", Object.assign({}, sendData, {
      classCodes: _user.classBeanList.map(item => item.classId),
      teacherCode: _user.userId,
      schoolCode: _user.userSchoolId,
      subjectCode: _user.userSubject
    }))
  },
  //获取学科
  getSubjectsForExam(sendData) {
    return axios.post(rootUrl + "teacher/diagnosis/getSubjectsForExam", sendData)
  },
  //教师报告----》班级标准分历史变动
  getStandardChangeScore(send) {
    let {subjectCode} = send, type = send.examType, releaseExamCode = send.code,
      teacherCode = localData.get('getTeacherInfo').userId;
    return axios.get(rootUrl + `teacherReport/getStandardScoreChange/${teacherCode}/${subjectCode}/${releaseExamCode}/${type}`)
  },
}

export let isEmptyObject = (obj) => {
  for (let key in obj) {
    return false
  }
  ;
  return true
}


